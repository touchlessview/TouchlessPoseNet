import { TouchlessView } from './lib/touchlessView'
import { PoseViewer, DatGUI } from './lib/modules';

const tv = new TouchlessView()
const viewer = new PoseViewer(tv)
const datGUI = new DatGUI(tv, viewer)

tv.create()

tv.didMount(()=> {
  viewer.create()
  datGUI.create()
});

