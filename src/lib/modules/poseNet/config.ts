import { ModelConfig, MultiPersonInferenceConfig } from '@tensorflow-models/posenet';

export interface PoseNetConfig {
  modelConfig?: ModelConfig;
  inferenceConfig?: MultiPersonInferenceConfig;
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
