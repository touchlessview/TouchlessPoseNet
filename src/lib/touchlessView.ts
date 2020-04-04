import { StreamModule, VideoStreem, ImageStream, PoseNetClass, PoseViewer , ActivePose } from './modules';
import { ActivePoses } from './modules/touchless.types';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Pose } from '@tensorflow-models/posenet';

export class TouchlessView extends StreamModule {
  videoStream: VideoStreem;
  imageStream: ImageStream;
  poseNet: PoseNetClass;
  viewer: PoseViewer;
  activePose: ActivePose;
  poses$: Observable<ActivePoses>
  activePose$: Observable<Pose>
  
  constructor() {
    super()
    this.videoStream = new VideoStreem();
    this.imageStream = new ImageStream();
    this.poseNet = new PoseNetClass();
    this.activePose = new ActivePose();
    this.viewer = new PoseViewer();
  }

  public async create() {
    this._willMount();
    await this.videoStream.create();
    await this.poseNet.create();
    this.imageStream.setConfig({ videoElement: this.videoStream.videoElement })
    this.imageStream.create();
    this.activePose.create();

    this.poses$ = this.imageStream.frames$.pipe(
      this.poseNet.operator(),
      this.activePose.operator()
      )
    this.activePose$ = this.poses$.pipe(map(data => data.poses[data.activeIndex[0]]))

    this.viewer.setConfig({ 
      canvasElement: this.imageStream.canvasElement,
      imageSream$: this.imageStream.frames$,
      poses$: this.poses$
    })
    this._didMount();
  }

  public setConfig() {
    
  }



}
