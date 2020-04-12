import { Pose } from '@tensorflow-models/posenet';

export type FilterFunction = (poses: Pose[], config: ActivePosesConfig) => Pose[];

export interface ActivePoseFilters {
  before?: FilterFunction;
  after?: FilterFunction;
  main?: FilterFunction;
}

export interface SceneConfig {
  width?: number
  height?: number
  center?: number
  passiveLeft?: number
  passiveRight?: number
} 

export interface PoseConfig {
  minScore?: number
  minShoulderDist?: number,
  maxShoulderDist?: number
} 

export interface ActivePosesConfig {
  scene?: SceneConfig
  pose?: PoseConfig
  custom?: any
}

export const defaultActivePoseConfig: ActivePosesConfig = {
  scene: {
    width: 640,
    height: 480,
    center: 320,
    passiveLeft: 50,
    passiveRight: 50,
  },
  pose: {
    minScore: 0.4,
    minShoulderDist: 100,
    maxShoulderDist: 640
  }
  
};

