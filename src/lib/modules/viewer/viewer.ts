import { defaultViewerConfig, ViewerConfig, PointArr } from './config';
import { StreamModule } from '../streamModule';
import { ActivePoses } from '../touchless.types';
import { Keypoint,  getAdjacentKeyPoints } from '@tensorflow-models/posenet';
import { combineLatest } from 'rxjs';


export class PoseViewer extends StreamModule {

  imageData: ImageData;
  config: ViewerConfig;
  canvasElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(config?: ViewerConfig) {
    super()
    this.config = { ...defaultViewerConfig, ...config };
    this.drawKeypoints = this.drawKeypoints.bind(this);
    this.drawSkeleton = this.drawSkeleton.bind(this);
  }

  public setConfig(config?: ViewerConfig): void {
    this.config = { ...this.config, ...config }
  }

  public create(): void {
    if (this.config.canvasElement) {
      this._willMount();
      this.canvasElement = document.createElement('canvas');
      this.canvasElement.width = this.config.canvasElement.width;
      this.canvasElement.height = this.config.canvasElement.height;
      this.context = this.canvasElement.getContext('2d');
      this.context.font = "10px serif";
      document.body.appendChild(this.canvasElement);
      
      this.viewStream();
      this._didMount();
    }
  }

  private viewStream() {
    if (this.config.poses$ && this.config.imageSream$) {
      let view$ = combineLatest(this.config.imageSream$, this.config.poses$)
      view$.subscribe(data => {
        this.context.putImageData(data[0], 0, 0);
        let activeIndex = data[1].activeIndex || []
        data[1].poses.forEach(({ keypoints }, index) => {
          const isActive = activeIndex.indexOf(index) != -1
          this.drawKeypoints(keypoints, isActive);
          this.drawSkeleton(keypoints, isActive);
        })
      })
    }
  }

  private drawPoint(y: number, x: number, isActive: boolean = false) {
    this.context.beginPath()
    this.context.arc(x, y, this.config.draw.pointRadius, 0, 2 * Math.PI)
    this.context.fillStyle = this.getColor(isActive)
    this.context.fill();
  }

  private drawText(y: number, x: number, score: number, isActive: boolean = false) {
    this.context.beginPath()
    this.context.fillText('x: ' + x.toFixed(0), x, y - 30,);
    this.context.fillText('y: ' + y.toFixed(0), x, y - 20,);
    this.context.fillText('s: ' + score.toFixed(3) , x, y -10,);
    this.context.fillStyle = this.getColor(isActive)
    this.context.fill();
  }

  public drawKeypoints(keypoints: Keypoint[], isActive: boolean = false) {
    const scale = this.config.draw.scale
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      if (keypoint.score < this.config.draw.minScore) {
        continue;
      }
      const { y, x } = keypoint.position;
      this.drawPoint(+y * scale, +x * scale, isActive);
      this.drawText(+y * scale, +x * scale, keypoint.score, isActive)
    }
  }

  public drawSegment([ay, ax] : PointArr, [by, bx] : PointArr, isActive: boolean = false) {
    const scale = this.config.draw.scale
    this.context.beginPath();
    this.context.moveTo(ax * scale, ay * scale);
    this.context.lineTo(bx * scale, by * scale);
    this.context.lineWidth = this.config.draw.lineWidth;
    this.context.strokeStyle = this.getColor(isActive)
    this.context.stroke();
  }

  public getColor(isActive: boolean) {
    return isActive ?
      this.config.draw.activeColor :
      this.config.draw.passiveColor
  }

  public toTuple({ y, x }) {
    return [y, x];
  }

  public drawSkeleton(keypoints: Keypoint[], isActive: boolean = false) {
    const adjacentKeyPoints = getAdjacentKeyPoints(keypoints, this.config.draw.minScore);
    adjacentKeyPoints.forEach((keypoints) => {
        this.drawSegment(this.toTuple(keypoints[0].position), this.toTuple(keypoints[1].position), isActive);
    });
  }


}
