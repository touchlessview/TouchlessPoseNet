import { Constraints, defaultVideoConfig, Config } from './config';
import { Helper } from '../helper';
import { Observable, Subject } from 'rxjs';


export class Stream {
  private _frames$: Subject<ImageData> = new Subject<ImageData>();

  get frames$(): Observable<ImageData> { return this._frames$.asObservable(); }

  get size() {
    return {
      width:  this.canvasElement.width,
      height: this.canvasElement.height
    }
  }
  get actizeZone() {
    return {
      start: Helper.getValueOfPercent(this.canvasElement.width, this.config.passiveLeft),
      end: Helper.getValueOfPercent(this.canvasElement.width, 100 - this.config.passiveRight)
    }
  }

  videoElement: HTMLVideoElement;
  canvasElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  config: Config;
  _centerX: number;
  _centerY: number;

  constructor(config?: Config) {
    this.config = {...defaultVideoConfig, ...config};
    this._create();
    this._play();
    this._stream();
  }

  private _create() {
    this.videoElement = document.createElement('video');
    this.canvasElement = document.createElement('canvas');
    this.videoElement.autoplay = this.config.autoplay;
    this.videoElement.width = this.canvasElement.width = this.config.width;
    this.videoElement.height = this.canvasElement.height = this.config.height;
    this.context = this.canvasElement.getContext('2d');
    this._rotate()
    document.body.appendChild(this.videoElement);
    document.body.appendChild(this.canvasElement);
  }

  private _rotate() {
    this._centerX = this.config.width / 2;
    this._centerY = this.config.height / 2;
    if (this.config.cameraRotate !== 0) {
      this._centerX = this.config.height / 2;
      this._centerY = this.config.width / 2;
      this.canvasElement.width = this.config.height;
      this.canvasElement.height = this.config.width;
    }
    this.context.translate(this._centerX, this._centerY);
    this.context.rotate(this.config.cameraRotate * Math.PI / 180);
  }

  private _play() {
    if (this.config.source) {
      this.videoElement.src = this.config.source;
    } else {
      const constraints: Constraints = {
        audio: false,
        video: {
          width: this.config.width,
          height: this.config.height,
          frameRate: {...this.config.videoFrameRate}
        }
      };
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia(constraints).then((mediaStream: MediaStream) => {
          this.videoElement.srcObject = mediaStream;
        });
      } else {
        console.log('Your browser does not support media or it`s blocked by security reason.');
      }
    }
  }

  private _stream() {
    setInterval(()=> {
      if (this.config.cameraRotate === 0) {
        this.context.drawImage(this.videoElement, -this._centerX, -this._centerY);
      } else {
        this.context.drawImage(this.videoElement, -this._centerY, -this._centerX,);
      }
      this._frames$.next(this.context.getImageData(0,0,this.canvasElement.width,this.canvasElement.height))
    }, this.config.frameRate * 10)
  }
}
