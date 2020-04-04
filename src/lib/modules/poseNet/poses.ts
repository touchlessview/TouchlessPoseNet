import { defaultModelConfig, defaultInferenceConfig, PoseNetConfig, } from './config';
import { load, ModelConfig, MultiPersonInferenceConfig, PoseNet, Pose } from '@tensorflow-models/posenet';
import { StreamModule } from '../streamModule';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class PoseNetClass extends StreamModule {

  net: PoseNet;
  modelConfig: ModelConfig;
  inferenceConfig: MultiPersonInferenceConfig;

  constructor(config?: PoseNetConfig) {
    super()
    this.modelConfig = {
      ...defaultModelConfig,
      ...(config && config.modelConfig ? config.modelConfig : {})
    };
    this.inferenceConfig = {
      ...defaultInferenceConfig,
      ...(config && config.inferenceConfig ? config.inferenceConfig : {})
    };
  }

  public setConfig(config?: PoseNetConfig): void {
    this.modelConfig = {
      ...this.modelConfig,
      ...(config && config.modelConfig ? config.modelConfig : {})
    };
    this.inferenceConfig = {
      ...this.inferenceConfig,
      ...(config && config.inferenceConfig ? config.inferenceConfig : {})
    };
  }

  public async create() { 
    this._willMount();
    try {
      this.net = await load(this.modelConfig);
      this._didMount();
    } catch (error) {
      console.log(error);
    }
  }

  public async asyncEstimatePoses(imageData: ImageData) {
    if (this._isMounted) {
      return await this.net.estimateMultiplePoses(imageData, this.inferenceConfig);
    } else {
      return []
    }
  } 

  private _estimatePoses(imageData: ImageData) {
    if (this._isMounted) {
      return this.net.estimateMultiplePoses(imageData, this.inferenceConfig);
    } else {
      return Promise.resolve([])
    }
  } 
  
  public operator() {
    return <T>(source: Observable<ImageData>) => 
    source.pipe(switchMap(image => from(this._estimatePoses(image))))
  }
}
