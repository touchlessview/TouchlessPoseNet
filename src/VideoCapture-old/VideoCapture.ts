import { IVideoSettings, IConstraints } from './Intefases'

export class VideoCapture {
  _parentId: string
  _id: string
  _class: string
  _hide: boolean
  _width: number
  _height: number
  _autoplay: boolean
  _src: string
  _audio: boolean
  _frameRate: {
    ideal?: number,
    min?: number
  }
  html: HTMLVideoElement
  _onCreated: any

  constructor(props?: IVideoSettings | null) {
    if (!props) props = {}
    this.html = null
    this._src = props.src || 'WebCam'
    this._parentId = props.parentId || ''
    this._id = props.parentId || 'video-capture'
    this._class = props.class || 'video-capture'
    this._width = props.width || 640
    this._height = props.height || 480
    this._frameRate = {
      ideal: props.frameRate || 60,
      min: props.minFrameRate || 10,
    }

    if (props.autoplay !== undefined) {
      this._autoplay = props.autoplay
    } else this._autoplay = true

    if (props.hide !== undefined) {
      this._hide = props.hide
    } else this._hide = false

    if (props.audio !== undefined) {
      this._audio = props.audio
    } else this._audio = true

    if (props.audio !== undefined) {
      this._audio = props.audio
    } else this._audio = true

    if (typeof props.onCreated === 'function') {
      this._onCreated = props.onCreated
    } else this._onCreated = function (e: any) {}
  }

  createVideo(): void {
    let video: HTMLVideoElement = document.createElement('video')
    video.id = this._id
    video.classList.add(this._class)
    video.autoplay = this._autoplay
    video.width = this._width
    video.height = this._height
    this._hide ? video.style.display = 'none' : null
    if (typeof this._parentId === 'string' && this._parentId !== "") {
      let el: HTMLElement = document.getElementById(this._parentId)
      if (el) {
        el.appendChild(video)
      }
    } else {
      document.body.appendChild(video);
    }
    this.html = document.getElementById(this._id) as HTMLVideoElement
    this._onCreated(this.html)
  }

  _getConstraints(): IConstraints {
    return {
      audio: this._audio,
      video: {
        widht: this._width,
        height: this._height,
        frameRate: {
          ideal: this._frameRate.ideal,
          min: this._frameRate.min,
        }
      }
    }
  }

  async _getStreem() {
    let constraints: IConstraints = this._getConstraints();
    let stream = null
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.html.srcObject = stream
      return
    } catch (err) {
      console.log(err.name + ": " + err.message)
      return
    }
  }

  async play() {
    if (this._src === 'WebCam') {
      await this._getStreem()
    } else {
      this.html.src = this._src
    }
  }

  stop() {
    this.html.src = ''
  }

  remuve() {
    this.stop()
    this.html.remove()
  }
}
