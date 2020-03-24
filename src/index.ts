import { Stream } from './lib/stream'
import { Poses } from './lib/poseNet'
import { mergeMap } from 'rxjs/operators';

const stream = new Stream()
const poseNet = new Poses()

stream.frames$.pipe(
  mergeMap( image => poseNet.estimatePoses(image)),
  mergeMap( poses => poseNet.activePose(poses) )
).subscribe(v => console.log(v))
// stream.frames$.subscribe({
//   next(v) { 
//     console.log(v);
//    }
// })
