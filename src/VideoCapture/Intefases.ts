export interface IVideoSettings {
  htmlVideo?: string
  parentId?: string
  id?: string
  class?: string
  hide?: boolean
  width?: number
  height?: number
  autoplay?: boolean
  src?: any
  audio?: boolean
  frameRate?: number
  minFrameRate?: number
  onCreated?: any 
}
export interface IConstraints {
  audio: boolean
  video: {
    widht: number,
    height: number,
    frameRate: {
      ideal: number,
      min: number,
    }
  }
}