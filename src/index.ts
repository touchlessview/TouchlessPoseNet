import { VideoCapture } from './VideoCapture-old'
import CanvasCapture from './CanvasCapture/CanvasCapture'

// import * as poseNet from '@tensorflow-models/posenet';

let canvasCapture = null
let videoCapture = new VideoCapture({
  audio: false,
  hide: true,
  frameRate: 10,
  onCreated: (video: HTMLVideoElement) => {
    canvasCapture = new CanvasCapture({ 
      video,
      rotate: 0,
      onCreated: () => {
        
      },
      onFrameUpdated: () => {

      }
     })
    canvasCapture.createCanvase()
    canvasCapture.start()
  }
})
videoCapture.createVideo()
videoCapture.play()
