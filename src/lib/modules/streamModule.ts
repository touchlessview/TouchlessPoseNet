
type CallbackFunction = () => void;

export abstract class StreamModule {
  
  protected _isMounted: boolean;
  protected _didMountCallbacks: Array<CallbackFunction>;
  protected _willMountCallbacks: Array<CallbackFunction>;

  constructor() {
    this._didMountCallbacks = []
    this._willMountCallbacks = []
  }
  
  get isMounted () {
    return this._isMounted;
  }

  protected _didMount(): void {
   this._isMounted = true; 
   if (this._didMountCallbacks.length) {
    this._didMountCallbacks.forEach(callback => { callback() });
   }
  }

  protected _willMount(): void {
    if (this._willMountCallbacks.length) {
     this._willMountCallbacks.forEach(callback => { callback() });
    }
  }

  public willMount(callback: CallbackFunction): void {
    if (typeof callback ==='function') {
      this._willMountCallbacks.push(callback);
    }
  }

  public didMount(callback: CallbackFunction): void {
    if (typeof callback ==='function') {
      this._didMountCallbacks.push(callback);
    }
  }

  abstract create(): void;
  abstract setConfig(): void;
}
