import { ModelConfig, MultiPersonInferenceConfig } from '@tensorflow-models/posenet';

export interface Swipe {
  left?: number
  right?: number
  tap?: number
} 


export interface SwipeTrackingConfig {
  historyLength?: number
  passiveTop?: number
  passiveBottom?: number
}

export const defaultSwipeTrackingConfig: SwipeTrackingConfig = {

  
};

