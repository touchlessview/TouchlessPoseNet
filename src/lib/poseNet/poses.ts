import { defaultModelConfig, defaultInferenceConfig, defaultScene, PoseNetConfig, Scene } from './config';
import { load, ModelConfig, MultiPersonInferenceConfig, PoseNet, Pose, Keypoint } from '@tensorflow-models/posenet';
import { Kp } from '../touchless.types';
import { Helper } from '../helper';

export class Poses {
  //private _poses$: Subject<Pose[]> = new Subject<Pose[]>();

  //get poses$(): Observable<Pose[]> { return this._poses$.asObservable(); }

  isLoaded: boolean;
  net: PoseNet;
  poses: Pose[];
  modelConfig: ModelConfig;
  inferenceConfig: MultiPersonInferenceConfig;
  scene: Scene;
  minShoulderDist: number;
  minScore: number;

  constructor(config?: PoseNetConfig) {
    this.modelConfig = {
      ...defaultModelConfig,
      ...(config && config.modelConfig ? config.modelConfig : {})
    };
    this.inferenceConfig = {
      ...defaultInferenceConfig,
      ...(config && config.inferenceConfig ? config.inferenceConfig : {})
    };
    this.scene = { ...defaultScene }
    this.minShoulderDist = this.scene.width * 0.1
    this.minScore = 0.5
    this._load();
  }

  private async _load() {
    try {
      this.net = await load(this.modelConfig);
      this.isLoaded = true;
    } catch (error) {
      console.log(error);
    }
  }

  private _activeScore(score: number) {
    return score >= this.minScore
  }

  async estimatePoses(imageData: ImageData) {
    if (this.isLoaded) {
      const poses = await this.net.estimateMultiplePoses(imageData, this.inferenceConfig);
      return poses
      //this._poses$.next(poses)
    } else {
      return []
      // this._poses$.next([])
    }
  }
  async activePose(poses: Pose[]) {
    if (poses.length === 0) {
      return null;
    } else {
      let indexCenter = null;
      let center = this.scene.width / 2;
      let minDistCenter = this.scene.width;
      poses.forEach((pose, index) => {
        const leftShoulder = pose.keypoints[Kp.leftShoulder];
        const rightShoulder = pose.keypoints[Kp.rightShoulder];
        const centerSholders = Helper.getKeypointsCenter(leftShoulder, rightShoulder);
        //console.log(Helper.getKeypointsDistanse(leftShoulder, rightShoulder) >= this.minShoulderDist);
        if (pose.score >= this.minScore &&
          // leftShoulder.score >= this.minScore &&
          // rightShoulder.score >= this.minScore &&
          Helper.getKeypointsDistanse(leftShoulder, rightShoulder) >= this.minShoulderDist &&
          //Math.abs(minDistCenter - center) >= Math.abs(minDistCenter - centerSholders.x) &&
          Helper.poseIsInActiveScene(pose, this.scene.active)
          ) {
            minDistCenter = centerSholders.x;
            indexCenter = index;
        }
      });
      return indexCenter === null ? null : poses[indexCenter];
    }
  }
}
