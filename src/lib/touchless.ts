import { Observable, Subject } from 'rxjs';
import { TouchlessEvent } from './touchless.types';

export class Touchless {
  get events$(): Observable<TouchlessEvent> { return this._events$.asObservable(); }
  private _events$: Subject<TouchlessEvent>;

  constructor() {}
}
