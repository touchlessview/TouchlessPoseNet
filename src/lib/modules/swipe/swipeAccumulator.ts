import { PoseHand, HandAccumulator } from "../touchless.types";

export interface MoveAccumulator {
  in?: number,
  out?: number
}

export class SwipeAccumulator {
  _accumulator: MoveAccumulator;
  _relativeSize: number;

  constructor() {
    this._accumulator = { in: 0, out: 0 }
    this._relativeSize = 100
  }

  get data() { return this._accumulator };
  get relativeSize() { return this._relativeSize };
  get swipeSize() { return this._getSwipeSize() }

  set relativeSize(size: number) {
    this._relativeSize = size;
  }

  public update(hand: PoseHand): HandAccumulator {
    if (hand !== undefined) {
      this._relativeSize = this.relativeSize;
      for (let prop in this._accumulator) {
        if (SwipeAccumulator.isSwipe(hand, prop, 0.6)) {
          this._accumulator[prop] += hand.moveSize;
        } else {
          this.reduce(prop as 'in' | 'out');
        }
      }
    } else {
      this.reduce()
    }
    return { hand, accumulator: this }
  }

  public clear(prop?: 'in' | 'out') {
    prop !== undefined ?
      this._accumulator[prop] = 0 :
      this._accumulator.in = this._accumulator.out = 0;
  }

  public reduce(prop?: 'in' | 'out') {
    if (prop !== undefined) {
      this._accumulator[prop] -= this._relativeSize * 0.2;
      this._accumulator[prop] = this._accumulator[prop] < 1 ? 0 : this._accumulator[prop]
    } else {
      for (let _prop in this._accumulator) {
        this._accumulator[_prop] -= this._relativeSize * 0.2;
        this._accumulator[_prop] = this._accumulator[_prop] < 1 ? 0 : this._accumulator[_prop]
      }
    }

  }

  private _getSwipeSize() {
    let swipe: MoveAccumulator = { in: 0, out: 0 };
    for (let prop in this._accumulator) {
      if (this._accumulator[prop] !== 0 && this._relativeSize !== 0) {
        swipe[prop] = this._accumulator[prop] / this._relativeSize
      }
      swipe[prop] = swipe[prop] > 1 ? 1 : swipe[prop];
      swipe[prop] = swipe[prop] < 0.01 ? 0 : swipe[prop];
    }
    return swipe;
  }

  static isSwipe(hand: PoseHand, direction: string, swipeBorderConst: number) {
    if (hand.keypoints[0].isActive && hand.moveDir === direction && hand.moveSize > 8) {
      const swipeZoneBorder = hand.keypoints[2].position.x - hand.relativeSize * swipeBorderConst
      if (direction === 'in') {
        if (hand.keypoints[0].position.x - swipeZoneBorder > 0) {
          return true
        } else return false
      } else if (direction === 'out') {
        if (hand.keypoints[0].position.x - swipeZoneBorder < 0) {
          return true
        } else return false
      }
    } return false
  }
}
