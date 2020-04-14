import { StreamModule, VideoStreem, ImageStream, PoseNetClass, SwipeTracking, SortPoses } from './modules';
import { SwipeData, SortedPoses, ActivePose } from './modules/touchless.types';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class TouchlessView extends StreamModule {
  videoStream: VideoStreem;
  imageStream: ImageStream;
  poseNet: PoseNetClass;
  sortPoses: SortPoses;
  swipeTracking: SwipeTracking;
  poses$: Observable<SortedPoses>
  activePose$: Observable<ActivePose>
  swipeData$: Observable<SwipeData>

  constructor() {
    super()
    this.videoStream = new VideoStreem();
    this.imageStream = new ImageStream();
    this.poseNet = new PoseNetClass();
    this.sortPoses = new SortPoses();
    this.swipeTracking = new SwipeTracking();
  }

  public async create() {
    this._willMount();
    await this.videoStream.create();
    await this.poseNet.create();
    this.imageStream.setConfig({ videoElement: this.videoStream.videoElement })
    this.imageStream.create();
    this.sortPoses.create();
    this.swipeTracking.create();
    
    this.poses$ = this.imageStream.frames$.pipe(
      this.poseNet.operator(),
      this.sortPoses.operator()
    )

    this.activePose$ = this.poses$.pipe(
      map(data => data.activePoses[0])
    )

    this.swipeData$ = this.activePose$.pipe(
      this.swipeTracking.operator()
    )

    this._didMount();
  }
  public setConfig() {
  }
}
