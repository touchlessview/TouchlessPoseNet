import { defaultActivePoseConfig, ActivePoseFilters, ActivePosesConfig, PoseConfig } from './config';
import { Pose, Keypoint } from '@tensorflow-models/posenet';
import { StreamModule } from '../streamModule';
import { Helper } from '../helper'
import { Kp } from '../touchless.types';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class ActivePose extends StreamModule {

  config: ActivePosesConfig;
  getIndexes: (poses: Pose[]) => number[];

  constructor(config?: ActivePosesConfig) {
    super()
    this.config = { ...defaultActivePoseConfig, ...config }
    this.getIndexes = this._getIndexes;
  }

  public setConfig(config?: ActivePosesConfig): void {
    this.config = { ...this.config, ...config }
  }

  public async create() {

  }

  private _getIndexes(poses: Pose[]): number[] {
    let minDist = this.config.scene.width;
    let indexRes = undefined;
    poses.forEach(({ score, keypoints }, index) => {
      const shoulders: [Keypoint, Keypoint] = [keypoints[Kp.leftShoulder], keypoints[Kp.rightShoulder]]
      if (+score >= this.config.pose.minScore && 
        Helper.getKeypointsDistanse(shoulders) >= this.config.pose.shoulderDist.min
      ) {
        const shoulderCenter = Helper.getKeypointsCenter(shoulders)
        const centerDist = Math.abs(this.config.scene.center - shoulderCenter.x)
        if (this.isInActiveZone(shoulderCenter) && centerDist < minDist) {
          indexRes = index;
          minDist = centerDist;
        }
      }
    })
    return [indexRes]
  }
  public isInActiveZone({x}) {
    return  x >= this.config.scene.passiveLeft ||  
    x <= this.config.scene.width - this.config.scene.passiveRight
  }

  public indexesStream() {
    return <T>(source: Observable<Pose[]>) => 
    source.pipe(switchMap(posers => of(this._getIndexes(posers))))
  }
  
}
