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
  shoulderDist?: ShoulderDist
} 
export interface ShoulderDist {
  min?: number
  max?: number 
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
    passiveLeft: 0,
    passiveRight: 0
  },
  pose: {
    minScore: 0.4,
    shoulderDist: { min: 100 }
  }
  
};

