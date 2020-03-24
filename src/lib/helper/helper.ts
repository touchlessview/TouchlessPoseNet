import { Keypoint, Pose } from '@tensorflow-models/posenet';
import { SceneActive } from '../poseNet';
import { Kp } from '../touchless.types';


export class Helper {
  static getPercent(value1: number, value2: number ) : number {
    if (value1 !== 0 && value2 !== 0  ) {
      return +(value1 / value2 * 100).toFixed(1);
    } else return 0;
  }
  static getValueOfPercent(value: number, percent: number ) {
    return +(value * percent / 100).toFixed(1);
  }
  static getKeypointsDistanse(keypoint1: Keypoint, keypoint2: Keypoint) {
    return Math.sqrt(((keypoint2.position.x - keypoint1.position.x) ** 2) + 
    ((keypoint2.position.y - keypoint1.position.y) ** 2))
  }
  static getKeypointsCenter(keypoint1: Keypoint, keypoint2: Keypoint) {
    return {
      x: (keypoint1.position.x + keypoint2.position.x) / 2,
      y: (keypoint1.position.y + keypoint2.position.y) / 2,
    }
  }
  static poseIsInActiveScene(pose: Pose, active: SceneActive) {
    const center = Helper.getKeypointsCenter(pose.keypoints[Kp.leftShoulder], pose.keypoints[Kp.rightShoulder])
    return center.x >= active.start && center.x <= active.end;
  }
}
