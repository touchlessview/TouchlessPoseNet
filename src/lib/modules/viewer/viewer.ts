import { defaultViewerConfig, ViewerConfig, PointArr } from './config';
import { StreamModule } from '../streamModule';
import { TouchlessView } from '../../touchlessView'
import { Keypoint, getAdjacentKeyPoints } from '@tensorflow-models/posenet';
import { combineLatest } from 'rxjs';

export class PoseViewer extends StreamModule {

  tv: TouchlessView;
  imageData: ImageData;
  config: ViewerConfig;
  canvasElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  swipe: { left: number, right: number }

  constructor(tv: TouchlessView, config?: ViewerConfig) {
    super()
    this.tv = tv
    this.config = { ...defaultViewerConfig, ...config };
    this.drawKeypoints = this.drawKeypoints.bind(this);
    this.drawSkeleton = this.drawSkeleton.bind(this);
    this.swipe = { left: 0, right: 0 }
  }

  public setConfig(config?: ViewerConfig): void {
    this.config = { ...this.config, ...config }
    if (this.isMounted) {
      this.remove();
      this.create();
    }
  }

  public create(): void {
    if (this.tv.imageStream.canvasElement) {
      this._willMount();
      this.canvasElement = document.createElement('canvas');
      this.canvasElement.width = this.tv.imageStream.canvasElement.width;
      this.canvasElement.height = this.tv.imageStream.canvasElement.height;
      this.context = this.canvasElement.getContext('2d');
      this.context.font = "10px serif";
      document.body.appendChild(this.canvasElement);
      this.viewStream();
      this._didMount();
    }
  }

  public remove(): void {
    this._isMounted = false;
    this.canvasElement.remove()
    this.canvasElement = undefined
    this.context = undefined
  }

  private viewStream() {
    if (this.tv) {
      let view$ = combineLatest(
        this.tv.imageStream.frames$,
        this.tv.poses$,
        this.tv.swipeData$
      )
      view$.subscribe(data => {
        this.context.putImageData(data[0], 0, 0);
        if (data[1]) {
          let activeIndex = data[1].activeIndex || []
          data[1].poses.forEach(({ keypoints }, index) => {
            const isActive = activeIndex.indexOf(index) != -1
            this.drawKeypoints(keypoints, isActive);
            this.drawSkeleton(keypoints, isActive);
          })
        }
        this.drawSwipeProgress(data[2].left || 0, 'left', 30)
        this.drawSwipeProgress(data[2].right || 0, 'right', 30)
        this.drawSceneSettings();
      })
    }
  }

  private drawPoint(y: number, x: number, isActive: boolean = false) {
    this.context.beginPath()
    this.context.arc(x, y, this.config.pointRadius, 0, 2 * Math.PI)
    this.context.fillStyle = this.getColor(isActive)
    this.context.fill();
  }

  private drawText(y: number, x: number, score: number, isActive: boolean = false) {
    this.context.beginPath()
    this.context.fillText('x: ' + x.toFixed(0), x, y - 30);
    this.context.fillText('y: ' + y.toFixed(0), x, y - 20);
    this.context.fillText('s: ' + score.toFixed(3), x, y - 10);
    this.context.fillStyle = '#fff'
    this.context.fill();
  }

  public drawKeypoints(keypoints: Keypoint[], isActive: boolean = false) {
    const scale = this.config.scale
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      if (keypoint.score < this.config.minScore) {
        continue;
      }
      const { y, x } = keypoint.position;
      this.drawPoint(+y * scale, +x * scale, isActive);
      this.drawText(+y * scale, +x * scale, keypoint.score, isActive)
    }
  }

  public drawSegment([ay, ax]: PointArr, [by, bx]: PointArr, isActive: boolean = false) {
    const scale = this.config.scale
    this.context.beginPath();
    this.context.moveTo(ax * scale, ay * scale);
    this.context.lineTo(bx * scale, by * scale);
    this.context.lineWidth = this.config.lineWidth;
    this.context.strokeStyle = this.getColor(isActive)
    this.context.stroke();
  }
  public drawSwipeProgress(progress: number, dir: 'left' | 'right', lineWidth: number) {
    progress = progress || 0.01
    const linePosition = this.canvasElement.height - lineWidth / 2
    const center = this.canvasElement.width / 2
    const progressDist = center * progress
    const progressFinish = dir === 'left' ? center - progressDist : center + progressDist

    this.context.beginPath()
    this.context.moveTo(center, linePosition)
    this.context.lineTo(progressFinish, linePosition)
    this.context.lineWidth = 30
    this.context.strokeStyle = "red"
    this.context.stroke()
  }

  public drawSceneSettings() {
    this.context.beginPath()
    let scene = this.tv.activePose.config.scene
    if (scene.passiveLeft) {
      this.context.rect(0, 0, scene.passiveLeft, scene.height)
    }
    if (scene.passiveRight) {
      this.context.rect(scene.width - scene.passiveRight, 0, scene.passiveRight, scene.height)
    }
    this.context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.context.fill();

    this.context.beginPath()
    this.context.moveTo(scene.center, 0);
    this.context.lineTo(scene.center, scene.height);
    this.context.lineWidth = 4;
    this.context.strokeStyle = 'rgb(0, 200, 83, 0.3)'
    this.context.stroke();
  }

  public getColor(isActive: boolean) {
    return isActive ?
      this.config.activeColor :
      this.config.passiveColor
  }

  public toTuple({ y, x }) {
    return [y, x];
  }

  public drawSkeleton(keypoints: Keypoint[], isActive: boolean = false) {
    const adjacentKeyPoints = getAdjacentKeyPoints(keypoints, this.config.minScore);
    adjacentKeyPoints.forEach((keypoints) => {
      this.drawSegment(this.toTuple(keypoints[0].position), this.toTuple(keypoints[1].position), isActive);
    });
  }
}
