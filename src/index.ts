import { TouchlessView } from './lib/touchlessView'
import { PoseViewer } from './lib/modules';

const tv = new TouchlessView()
const viewer = new PoseViewer(tv)

tv.create()

tv.didMount(()=> {
  viewer.create()
});