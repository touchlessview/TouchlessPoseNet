import { Pose, Vector2D, Keypoint } from "@tensorflow-models/posenet/dist/types";
import { SwipeAccumulator } from "./swipe/SwipeAccumulator";

export enum TouchlessEventType {
  SlideLeft = 'SlideLeft',
  SlideRight = 'SlideRight'
}

export interface SortedPoses {
  passivePoses: Pose[]
  activePoses: ActivePose[];
}

export interface SwipeData {
  left?: number;
  right?: number
}

export interface ActiveKeypoint extends Keypoint {
  isActive?: boolean
}

export interface ActivePose  {
  keypoints: ActiveKeypoint[];
  score: number;
  center: Vector2D;
  time?: number;
  relativeSize?: number;
}

export interface PoseHand extends ActivePose {
  side: string;
  moveDir?: 'in' | 'out' | 'top' | 'bottom';
  moveSize?: number;
  swipeIn?: number;
  swipeOut?: number;
}

export interface HandAccumulator {
  hand: PoseHand;
  accumulator: SwipeAccumulator;
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
