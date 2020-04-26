import { Observable } from 'rxjs';
import { ActivePose } from '../touchless.types';

export interface SwipeTrackingConfig {
  historyLength?: number
  swipeSensitivity?: number 
  activePose$?: Observable<ActivePose>;
}

export const defaultSwipeTrackingConfig: SwipeTrackingConfig = {
  swipeSensitivity: 0.1
};

