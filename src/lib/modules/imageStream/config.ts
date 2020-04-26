export interface CanvasConfig {
  videoElement?: HTMLVideoElement;
  containerId?: string;
  id?: string;
  className?: string;
  rotate?: 0 | 90 | -90;
  frameRate?: number;
}

export const defaultCanvasConfig: CanvasConfig = {
  id: 'canvas-capture',
  className: 'canvas-capture',
  rotate: 0,
  frameRate: 5
};
