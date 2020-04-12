import { StreamModule, VideoStreem, ImageStream, PoseNetClass, ActivePose, SwipeTracking } from './modules';
import { ActivePoses, MainPose, SwipeData } from './modules/touchless.types';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class TouchlessView extends StreamModule {
  videoStream: VideoStreem;
  imageStream: ImageStream;
  poseNet: PoseNetClass;
  activePose: ActivePose;
  swipeTracking: SwipeTracking;
  poses$: Observable<ActivePoses>
  activePose$: Observable<MainPose>
  swipeData$: Observable<SwipeData>

  constructor() {
    super()
    this.videoStream = new VideoStreem();
    this.imageStream = new ImageStream();
    this.poseNet = new PoseNetClass();
    this.activePose = new ActivePose();
    this.swipeTracking = new SwipeTracking();
  }

  public async create() {
    this._willMount();
    await this.videoStream.create();
    await this.poseNet.create();
    this.imageStream.setConfig({ videoElement: this.videoStream.videoElement })
    this.imageStream.create();
    this.activePose.create();
    this.swipeTracking.create();
    this.poses$ = this.imageStream.frames$.pipe(
      this.poseNet.operator(),
      this.activePose.operator()
    )

    this.activePose$ = this.poses$.pipe(
      map(data => {
        if (typeof data.activeIndex[0] === 'number') {
          return { 
            ...data.poses[data.activeIndex[0]], 
            activeCenter: data.activeCenter[0]
          }
        } else return undefined  
      })
    )
    this.swipeData$ = this.activePose$.pipe(
      this.swipeTracking.operator()
    )
    this._didMount();
  }
  public setConfig() {
  }
}
