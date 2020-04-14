
export type PointArr = [number, number] | any[]

export interface ViewerConfig {
  minScore?: number
  activeColor?: string;
  passiveColor?: string;
  pointRadius?: number;
  lineWidth?: number;
  scale?: number;
}

export const defaultViewerConfig: ViewerConfig = {
  minScore: 0.1,
  activeColor: '#00c853',
  passiveColor: '#eeeeee',
  pointRadius: 5,
  lineWidth: 2,
  scale: 1
};
