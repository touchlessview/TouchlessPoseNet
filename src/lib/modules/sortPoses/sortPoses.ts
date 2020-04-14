import { defaultSortPosesConfig, SortPosesConfig } from './config';
import { Pose, Keypoint } from '@tensorflow-models/posenet';
import { Vector2D } from '@tensorflow-models/posenet/dist/types';
import { StreamModule } from '../streamModule';
import { Helper } from '../helper'
import { Kp, SortedPoses, ActivePose, ActiveKeypoint } from '../touchless.types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SortPoses extends StreamModule {
  shoulderCenter: Vector2D;
  config: SortPosesConfig;
  getSortedPoses: any; 

  constructor(config?: SortPosesConfig) {
    super()
    this.config = { ...defaultSortPosesConfig, ...config }
  }

  public setConfig(config?: SortPosesConfig): void {
    this.config = { ...this.config, ...config }
  }

  public async create() {
    if (!this.getSortedPoses) {
      this.getSortedPoses = this._getSortedPoses;
    }
  }

  public operator() {
    return (source: Observable<Pose[]>) => 
    source.pipe(map(poses => this.getSortedPoses(poses)))
  }

  private _getSortedPoses(poses: Pose[]):  SortedPoses {
    let activeCenter: Vector2D = undefined
    let activePose: ActivePose = undefined 
    let minDist = this.config.scene.width;
    let indexRes = undefined;
    poses.forEach(({ score, keypoints }, index) => {
      const shoulders: [Keypoint, Keypoint] = [keypoints[Kp.leftShoulder], keypoints[Kp.rightShoulder]]
      if (+score >= this.config.pose.minScore && 
        Helper.getKeypointsDistanse(shoulders) >= this.config.pose.minShoulderDist
      ) {
        const shoulderCenter = Helper.getKeypointsCenter(shoulders)
        const centerDist = Math.abs(this.config.scene.center - shoulderCenter.x)
        if (this.isInActiveZone(shoulderCenter) && centerDist < minDist) {
          indexRes = index;
          minDist = centerDist;
          activeCenter = shoulderCenter
        }
      }
    })
    if (indexRes !== undefined) {
      activePose = {
        center: activeCenter,
        score: poses[indexRes].score,
        keypoints: this._getActiveKeypoints(poses[indexRes].keypoints) 
      } 
    }
    return { activePoses: [activePose], passivePoses: poses.splice(indexRes, 1) } 
  }

  private _getActiveKeypoints(keypoints): ActiveKeypoint[] {
    return keypoints.map(keypoint => {
      const isActive = Helper.isActiveKeypoint(
        keypoint, 
        this.config.pose.relativePassiveTop,
        this.config.pose.relativePassiveBottom,
        'y', this.config.pose.minScore
        )
      return { ...keypoint,  isActive}
    })
  }

  public isInActiveZone({x}) {
    return  x >= this.config.scene.passiveLeft &&  
    x <= this.config.scene.width - this.config.scene.passiveRight
  }
}
