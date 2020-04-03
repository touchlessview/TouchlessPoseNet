 import { defaultSwipeTrackingConfig, SwipeTrackingConfig } from './config';
import { Pose } from '@tensorflow-models/posenet';
import { StreamModule } from '../streamModule';

export class SwipeTracking extends StreamModule {

  config: SwipeTrackingConfig;
  before: any;
  after: any;
  main: any;
  filter: any;

  constructor(config?: SwipeTrackingConfig) {
    super()
    this.config = { ...defaultSwipeTrackingConfig, ...config }
  }

  public setConfig(config?: SwipeTrackingConfig): void {
    this.config = { ...this.config, ...config }
  }

  public async create() { 
    
  }

}
