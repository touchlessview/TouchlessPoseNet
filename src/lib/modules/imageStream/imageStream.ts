import { defaultCanvasConfig, CanvasConfig } from './config';
import { StreamModule } from '../streamModule';
import { Observable, Subject } from 'rxjs';

export class ImageStream extends StreamModule {

  private _frames$: Subject<ImageData> = new Subject<ImageData>();
  get frames$(): Observable<ImageData> { return this._frames$.asObservable(); }

  canvasElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  config: CanvasConfig;
  _centerX: number;
  _centerY: number;

  constructor(config?: CanvasConfig) {
    super()
    this.config = { ...defaultCanvasConfig, ...config };
  }

  public setConfig(config?: CanvasConfig): void {
    this.config = { ...this.config, ...config };
  }

  public create(): void {
    if (this.config.videoElement) {
      this._willMount();
      this.canvasElement = document.createElement('canvas');
      this.context = this.canvasElement.getContext('2d');
      this.canvasElement.width = this.config.videoElement.width;
      this.canvasElement.height = this.config.videoElement.height;
      // this.context.translate(this.canvasElement.width, 0);
      // this.context.scale(-1,1);
      this._stream()
      this._didMount();
    } else {
      console.log('You need to videoElement to create a stream')
    }
  }

  private _stream(): void {
    const timeInterval = this.config.frameRate * 10;
    if (this.config.rotate !== 0) {
      this._rotate();
      setInterval(() => {
        this.context.drawImage(this.config.videoElement, -this._centerY, -this._centerX);
        this._frames$.next(this.context.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height))
      }, timeInterval)
    } else {
      setInterval(() => {
        this.context.drawImage(this.config.videoElement, 0, 0);
        this._frames$.next(this.context.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height))
      }, timeInterval)
    }
  }

  private _rotate(): void {
    this._centerX = this.config.videoElement.height / 2;
    this._centerY = this.config.videoElement.width / 2;
    this.canvasElement.width = this.config.videoElement.height;
    this.canvasElement.height = this.config.videoElement.width;
    this.context.translate(this._centerX, this._centerY);
    this.context.rotate(this.config.rotate * Math.PI / 180);
  }
}
