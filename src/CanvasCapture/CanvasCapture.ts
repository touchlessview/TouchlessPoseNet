import { ICanvasSettings } from './Intefases'

export default class CanvasCapture {
  _parentId: string
  _id: string
  _class: string
  _video: HTMLVideoElement
  _rotate: number
  _hide: boolean
  _frameRate: number
  html: HTMLCanvasElement
  ctx: any
  isStarted: boolean
  _halfWidth: number
  _halfHeight: number
  _onCreated: any
  _onFrameUpdated: any

  constructor(props: ICanvasSettings) {
    this._parentId = props.parentId || ''
    this._id = props.id || 'canvas-capture'
    this._class = props.class || 'canvas-capture'
    this._video = props.video
    this._rotate = props.rotate || 0
    this._frameRate = props.frameRate || 10
    this.isStarted = false
    
    if (props.hide !== undefined) {
      this._hide = props.hide
    } else this._hide = false

    if (typeof props.onCreated === 'function') {
      this._onCreated = props.onCreated
    } else this._onCreated = function (e: any) {}

    if (typeof props.onFrameUpdated === 'function') {
      this._onFrameUpdated = props.onFrameUpdated
    } else this._onFrameUpdated = function (e: any) {}

    this._halfWidth = 0
    this._halfHeight = 0
    this._draw = this._draw.bind(this)
  }

  createCanvase(): void {
    let canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.id = this._id
    canvas.classList.add(this._class)
    this._halfWidth = this._video.height/2
    this._halfHeight = this._video.width/2
    this._setRotate()
    if (this._rotate !== 0) {
      canvas.width = this._video.height
      canvas.height = this._video.width
    } else {
      canvas.width = this._video.width
      canvas.height = this._video.height
    }
    
    this._hide ? canvas.style.display = 'none' : null
    if (typeof this._parentId === 'string' && this._parentId !== "") {
      let el: HTMLElement = document.getElementById(this._parentId)
      if (el) {
        el.appendChild(canvas)
      }
    } else {
      document.body.appendChild(canvas);
    }
    this.html = document.getElementById(this._id) as HTMLCanvasElement
    this._onCreated(this.html)
    this.ctx = this.html.getContext('2d')
    this._setRotateImg()
  }

  start() {
    this.isStarted = true
    this._draw()
  }

  stop() {
    this.isStarted = false
  }

  remuve() {
    this.stop()
    this.html.remove()
  }

  _draw(): void {
    if (this.isStarted === true) {
      if (this._rotate === 0) {
        this.ctx.drawImage(this._video, -this._halfWidth, -this._halfHeight)
      } else {
        this.ctx.drawImage(this._video, -this._halfHeight, -this._halfWidth)
      }
      this._onFrameUpdated()
      setTimeout(this._draw, this._frameRate * 10);
    }
  }

  _setRotate() {
    if (!(this._rotate === 0 || this._rotate === 90 || this._rotate === -90) ) {
      this._rotate = 0
    }
  }

  _setRotateImg() {
    if (this.ctx) {
      this.ctx.translate(this._halfWidth , this._halfHeight );
      this.ctx.rotate(this._rotate * Math.PI / 180);
    }
  }
}