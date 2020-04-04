import { Pose } from "@tensorflow-models/posenet/dist/types";

export enum TouchlessEventType {
  SlideLeft = 'SlideLeft',
  SlideRight = 'SlideRight'
}

export interface ActivePoses {
  activeIndex: number[],
  poses: Pose[]
}

export interface PoseTime extends Pose {
  time: number
}

export enum Kp {
  nose,
  leftEye,
  rightEye,
  leftEar,
  rightEar,
  leftShoulder,
  rightShoulder,
  leftElbow,
  rightElbow,
  leftWrist,
  rightWrist,
  leftHip,
  rightHip,
  leftKnee,
  rightKnee,
  leftAnkle,
  rightAnkle,
}

export interface TouchlessEvent {
  type: TouchlessEventType;
}
