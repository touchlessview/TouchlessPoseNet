export enum TouchlessEventType {
  SlideLeft = 'SlideLeft',
  SlideRight = 'SlideRight'
}

export interface TouchlessEvent {
  type: TouchlessEventType;
}
