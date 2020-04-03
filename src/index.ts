import { TouchlessView } from './lib/touchlessView'

const tv = new TouchlessView()

tv.create()

tv.didMount(()=> {
  tv.viewer.create() 
});