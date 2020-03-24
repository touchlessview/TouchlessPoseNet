export interface VideoFrameRate {
  ideal: number;
  min: number;
}

export interface VideoProps {
  width: number;
  height: number;
  frameRate: VideoFrameRate;
}

export interface Constraints {
  audio: boolean;
  video: VideoProps;
}

export interface Config {
  container?: HTMLElement;
  id?: string;
  className?: string;
  hidden?: boolean;
  width?: number;
  height?: number;
  cameraRotate?: 0 | 90 | -90;
  autoplay?: boolean;
  audio?: boolean;
  videoFrameRate?: VideoFrameRate;
  frameRate?: number;
  source?: string;
  passiveLeft?: number;
  passiveRight?: number;
  activeCenter?: number;
}

export const defaultVideoConfig: Config = {
  id: 'video-capture',
  className: 'video-capture',
  audio: false,
  width: 640,
  height: 480,
  cameraRotate: 0, 
  videoFrameRate: {
    ideal: 30,
    min: 10
  },
  frameRate: 10,
  autoplay: true,
  hidden: false,
  passiveLeft: 0,
  passiveRight: 0,
  activeCenter: 50,
};
