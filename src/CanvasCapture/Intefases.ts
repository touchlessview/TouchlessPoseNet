export interface ICanvasSettings {
  parentId?: string
  id?: string
  class?: string
  video: HTMLVideoElement
  rotate?: 90 | -90 | 0
  hide?: boolean
  frameRate?: number
  onCreated?: any
  onFrameUpdated?: any
}