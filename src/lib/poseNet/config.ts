import { ModelConfig, MultiPersonInferenceConfig } from '@tensorflow-models/posenet';

export interface PoseNetConfig {
  modelConfig?: ModelConfig;
  inferenceConfig?: MultiPersonInferenceConfig;
}

export interface Scene {
  width: number;
  height: number;
  active: SceneActive
}

export interface SceneActive {
  start: number;
  end: number;
}

export interface SceneSize {
  width: number;
  height: number;
}

export const defaultModelConfig: ModelConfig = {
  architecture: 'MobileNetV1',
  outputStride: 16,
  inputResolution: 300,
  multiplier: 0.75,
  quantBytes: 2,
  modelUrl: '',
};

export const defaultInferenceConfig: MultiPersonInferenceConfig = {
  flipHorizontal: false,
  maxDetections: 5,
  scoreThreshold: 0.5,
  nmsRadius: 30
};

export const defaultScene: Scene = {
  width: 640,
  height: 480,
  active: {
    start: 0,
    end: 640
  }
};
