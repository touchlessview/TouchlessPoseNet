import { defaultActivePoseConfig, ActivePoseFilters, ActivePosesConfig, PoseConfig } from './config';
import { Pose, Keypoint } from '@tensorflow-models/posenet';
import { StreamModule } from '../streamModule';
import { Helper } from '../helper'
import { Kp, ActivePoses } from '../touchless.types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ActivePose extends StreamModule {

  config: ActivePosesConfig;
  getActiveIndex: (poses: Pose[]) => ActivePoses;

  constructor(config?: ActivePosesConfig) {
    super()
    this.config = { ...defaultActivePoseConfig, ...config }
  }

  public setConfig(config?: ActivePosesConfig): void {
    this.config = { ...this.config, ...config }
  }

  public async create() {
    if (!this.getActiveIndex) {
      this.getActiveIndex = this._getActiveIndex;
    }
  }

  public operator() {
    return <T>(source: Observable<Pose[]>) => 
    source.pipe(map(poses => this.getActiveIndex(poses)))
  }

  private _getActiveIndex(poses: Pose[]):  ActivePoses {
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
    return { activeIndex: [indexRes], poses } 
  }
  public isInActiveZone({x}) {
    return  x >= this.config.scene.passiveLeft ||  
    x <= this.config.scene.width - this.config.scene.passiveRight
  }
}
