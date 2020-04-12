import { Pose, Vector2D } from "@tensorflow-models/posenet/dist/types";

export enum TouchlessEventType {
  SlideLeft = 'SlideLeft',
  SlideRight = 'SlideRight'
}

export interface ActivePoses {
  activeCenter: Vector2D[];
  activeIndex: number[];
  poses: Pose[];
}

export interface SwipeData {
  left?: number;
  right?: number
}

export interface MainPose extends Pose {
  activeCenter: Vector2D;
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
