import { ModelConfig, MultiPersonInferenceConfig } from '@tensorflow-models/posenet';
import { Vector2D } from '@tensorflow-models/posenet/dist/types';

export interface Swipe {
  left?: number
  right?: number
  tap?: number
} 

export interface SwipeDirAccumulator {
  in: number[]
  out: number[]
}

export interface Point {
  x: number
  y: number
}

export interface PrevPosition {
  leftWrist: Vector2D
  rightWrist: Vector2D
}

export interface SwipeAccumulator {
  left: SwipeDirAccumulator
  right: SwipeDirAccumulator
}

export interface HandsHistory {
  left: number[]
  right: number[]
}

export interface SwipeTrackingConfig {
  historyLength?: number
  passiveTop?: number
  passiveBottom?: number
  swipeSensitivity?: number 
}

export const defaultSwipeTrackingConfig: SwipeTrackingConfig = {
  swipeSensitivity: 0.1
  
};

