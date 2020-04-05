import { Observable } from "rxjs";
import { ActivePoses, SwipeData } from '../touchless.types';
import { Pose } from '@tensorflow-models/posenet';

export type PointArr = [number, number] | any[]

export interface DrawViewer {
  minScore?: number
  activeColor?: string;
  passiveColor?: string;
  pointRadius?: number;
  lineWidth?: number;
  scale?: number;
}

export interface ViewerConfig {
  canvasElement?: HTMLCanvasElement;
  activePoseIndex?: number;
  passiveLeft?: number;
  passiveRight?: number;
  imageSream$?: Observable<ImageData>
  poses$?: Observable<ActivePoses>
  swipe$?: Observable<SwipeData>
  draw?: DrawViewer
}

export const defaultViewerConfig: ViewerConfig = {
  draw: {
    minScore: 0.1,
    activeColor: '#00c853',
    passiveColor: '#eeeeee',
    pointRadius: 5,
    lineWidth: 2,
    scale: 1
  }
};
