import { Stream } from './lib/stream'
import { Poses } from './lib/poseNet'
import { mergeMap, map } from 'rxjs/operators';

const stream = new Stream()
const poseNet = new Poses()

stream.frames$.pipe(
  mergeMap( image => poseNet.estimatePoses(image)),
  map( poses => poseNet.activePose(poses) )
).subscribe(v => console.log(v))
