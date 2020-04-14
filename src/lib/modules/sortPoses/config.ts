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
  maxShoulderDist?: number,
  relativePassiveTop?: number
  relativePassiveBottom?: number
} 

export interface SortPosesConfig {
  scene?: SceneConfig
  pose?: PoseConfig
  custom?: any
}

export const defaultSortPosesConfig: SortPosesConfig = {
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
    maxShoulderDist: 640,
    relativePassiveTop: 0,
    relativePassiveBottom: 400
  }
  
};

