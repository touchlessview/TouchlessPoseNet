import { Constraints, defaultVideoConfig, Config } from './config';
import { Observable, Subject } from 'rxjs';

export class Stream {
  private _frames$: Subject<ImageData> = new Subject<ImageData>();

  get frames$(): Observable<ImageData> { return this._frames$.asObservable(); }

  videoElement: HTMLVideoElement;
  canvasElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  config: Config;

  constructor(config?: Config) {
    this.config = {...defaultVideoConfig, ...config};
    this._create();
    this._play();
  }

  private _create() {
    this.videoElement = document.createElement('video');
    this.canvasElement = document.createElement('canvas');
    // this.instance.id = this.config.id;
    // this.instance.classList.add(this.config.className);
    this.videoElement.autoplay = this.config.autoplay;
    this.videoElement.width = this.canvasElement.width = this.config.width;
    this.videoElement.height = this.canvasElement.height = this.config.height;

    this.context = this.canvasElement.getContext('2d');

    this.context.drawImage(this.videoElement, 0, 0);

    // this.instance.style.display = this.config.hidden ? 'null' : 'inherited';
    // (this.config.container || document.body).appendChild(this.instance);
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
          frameRate: {...this.config.frameRate}
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
}
