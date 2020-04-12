import { defaultCanvasConfig, CanvasConfig } from './config';
import { StreamModule } from '../streamModule';
import { Observable, Subject } from 'rxjs';

let _interval = undefined
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
    if (this.isMounted) {
      this.remove();
      this.create();
    }
  }

  public create(): void {
    if (this.config.videoElement) {
      this._willMount();
      this.canvasElement = document.createElement('canvas');
      this.context = this.canvasElement.getContext('2d');
      this.canvasElement.width = this.config.videoElement.width;
      this.canvasElement.height = this.config.videoElement.height;
      this._stream()
      this._didMount();
    } else {
      console.log('You need videoElement to create a stream')
    }
  }

  public remove(): void {
    this._isMounted = false;
    clearInterval(_interval)
    _interval = undefined
    this.canvasElement.remove()
    this.canvasElement = undefined
    this.context = undefined
  }

  private _stream(): void {
    const timeInterval = 1000 / this.config.frameRate;
    const width = this.canvasElement.width;
    const height = this.canvasElement.height;
    if (this.config.rotate !== 0) {
      this._rotate();
      _interval = setInterval(() => {
        this.context.drawImage(this.config.videoElement, -this._centerY, -this._centerX);
        this._frames$.next(this.context.getImageData(0, 0, width, height))
      }, timeInterval)
    } else {
      _interval = setInterval(() => {
        this.context.drawImage(this.config.videoElement, 0, 0);
        this._frames$.next(this.context.getImageData(0, 0, width, height))
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
