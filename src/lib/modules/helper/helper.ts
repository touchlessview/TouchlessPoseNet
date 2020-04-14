import { Keypoint, Pose } from '@tensorflow-models/posenet';
//import { SceneActive } from '../poseNet';
//import { Kp } from '../touchless.types';


export class Helper {
  static getPercent(value1: number, value2: number ) : number {
    if (value1 !== 0 && value2 !== 0  ) {
      return +(value1 / value2 * 100).toFixed(1);
    } else return 0;
  }
  static getValueOfPercent(value: number, percent: number ) {
    return +(value * percent / 100).toFixed(1);
  }

  static getKeypointsDistanse(keypoints: [Keypoint, Keypoint]) {
    return Math.sqrt(((keypoints[1].position.x - keypoints[0].position.x) ** 2) + 
    ((keypoints[1].position.y - keypoints[0].position.y) ** 2))
  }

  static getKeypointsCenter(keypoints: [Keypoint, Keypoint]) {
    return {
      x: (keypoints[0].position.x + keypoints[1].position.x) / 2,
      y: (keypoints[0].position.y + keypoints[1].position.y) / 2,
    }
  }

  static sumArr(array: number[]) {
    if (Array.isArray(array) && array.length) {
      return array.reduce((accumulator, value) => accumulator + value)
    } else return 0
  }

  static isActiveKeypoint(keypoint: Keypoint, min: number, max: number, c: 'x' | 'y', minScore?: number) {
    minScore = minScore || 0
    if (
      keypoint.score >= minScore &&
      keypoint.position[c] >= min &&
      keypoint.position[c] <= max
    ) {
      return true
    } 
    return false
  }
}
