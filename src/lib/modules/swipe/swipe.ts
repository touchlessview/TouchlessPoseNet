import { defaultSwipeTrackingConfig, SwipeTrackingConfig } from './config';
import { Kp, ActivePose, PoseHand, HandAccumulator, SwipeData } from '../touchless.types';
import { SwipeAccumulator } from './SwipeAccumulator';
import { StreamModule } from '../streamModule';
import { Observable, combineLatest } from 'rxjs';
import { map, pairwise, share } from 'rxjs/operators';
import { reverseKeypoint } from '../helpers';

export class SwipeTracking extends StreamModule {

  leftHand$: Observable<HandAccumulator>;
  rightHand$: Observable<HandAccumulator>;
  swipe$: Observable<SwipeData>;
  relativeSize: number;
  config: SwipeTrackingConfig;
  frameRate: number

  constructor(config?: SwipeTrackingConfig) {
    super()
    this.config = { ...defaultSwipeTrackingConfig, ...config }
  }

  public setConfig(config?: SwipeTrackingConfig): void {
    this.config = { ...this.config, ...config }
  }

  public async create(config?: SwipeTrackingConfig) {
    this.setConfig(config);
    if (this.config.activePose$) {
      this.leftHand$ = this.config.activePose$.pipe(
        this._handAccumulator('left'),
        share()
      );
      this.rightHand$ = this.config.activePose$.pipe(
        this._handAccumulator('right'),
        share()
      );
      this.swipe$ = combineLatest(this.leftHand$, this.rightHand$).pipe(
        map(hands => this._getSwipe(...hands)),
        share()
      )
    }
  }

  private _getSwipe(leftHand: HandAccumulator, rightHan: HandAccumulator): SwipeData {
    const leftSwipeAccum = leftHand.accumulator.swipeSize;
    const rightSwipeAccum = rightHan.accumulator.swipeSize;
    const leftSwipe = Math.max(leftSwipeAccum.in, rightSwipeAccum.out);
    const rightSwipe = Math.max(rightSwipeAccum.in, leftSwipeAccum.out);

    if (leftSwipe > rightSwipe) {
      leftHand.accumulator.reduce('out');
      rightHan.accumulator.reduce('in');
    } else {
      leftHand.accumulator.reduce('in');
      rightHan.accumulator.reduce('out');
    }
    if (leftSwipe > 0.99 || rightSwipe > 0.99) {
      leftHand.accumulator.clear();
      rightHan.accumulator.clear();
    }
    return {
      left: leftSwipe,
      right: rightSwipe
    }
  }

  private _handAccumulator(side) {
    const accumulator = new SwipeAccumulator();
    return (source: Observable<PoseHand>) =>
      source.pipe(
        map(pose => this._getHandPose(pose, side)),
        pairwise(),
        map(poseHand => accumulator.update(
          this._setHandMove(poseHand)
        )),
        share()
      )
  }

  private _setHandMove(handHistory: PoseHand[]): PoseHand {
    if (
      handHistory[0] !== undefined &&
      handHistory[1] !== undefined &&
      Math.abs(handHistory[0].center.x - handHistory[1].center.x) <
      handHistory[1].relativeSize / 2
    ) {
      const _old = handHistory[0].keypoints[0].position;
      const _new = handHistory[1].keypoints[0].position;
      const horizontal = (_new.x - _old.x)
      const vertical = (_old.y - _new.y);
      if (Math.abs(horizontal) > Math.abs(vertical)) {
        handHistory[1].moveDir = horizontal > 0 ? 'in' : 'out';
        handHistory[1].moveSize = Math.abs(horizontal)
      } else {
        handHistory[1].moveDir = vertical > 0 ? 'top' : 'bottom';
        handHistory[1].moveSize = Math.abs(vertical)
      }
      return handHistory[1]
    }
    return undefined
  }

  private _getHandPose(pose: ActivePose, side: 'left' | 'right'): PoseHand {
    if (pose !== undefined) {
      const ignoreReverse = side === 'right';
      const sceneWidth = 640;
      return {
        ...pose, side,
        keypoints: [
          reverseKeypoint(pose.keypoints[Kp[side + 'Wrist']], sceneWidth, ignoreReverse),
          reverseKeypoint(pose.keypoints[Kp[side + 'Elbow']], sceneWidth, ignoreReverse),
          reverseKeypoint(pose.keypoints[Kp[side + 'Shoulder']], sceneWidth, ignoreReverse)
        ]
      }
    } else return undefined
  }
}
