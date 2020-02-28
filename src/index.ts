//import * as _ from 'lodash';
import VideoCapture from './VideoCapture/VideoCapture'
import CanvasCapture from './CanvasCapture/CanvasCapture'

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