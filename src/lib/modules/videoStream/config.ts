export interface FrameRate {
  ideal: number;
  min: number;
}

export interface VideoProps {
  width: number;
  height: number;
  frameRate: FrameRate;
}

export interface Constraints {
  audio: boolean;
  video: VideoProps;
}

export interface Config {
  containerSelector?: string;
  id?: string;
  className?: string;
  hidden?: boolean;
  width?: number;
  height?: number;
  autoplay?: boolean;
  audio?: boolean;
  frameRate?: FrameRate;
  source?: string;
}

export const defaultVideoConfig: Config = {
  id: 'video-capture',
  className: 'video-capture',
  audio: false,
  width: 640,
  height: 480,
  frameRate: {
    ideal: 30,
    min: 10
  },
  autoplay: true,
  hidden: false,
};
