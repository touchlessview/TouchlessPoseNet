import { ModelConfig, PoseNetOutputStride } from '@tensorflow-models/posenet';
import { GUI } from 'dat.gui';
import { PoseViewer } from './viewer';
import { TouchlessView } from '../../touchlessView'
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

export class DatGUI {
  tv: TouchlessView
  viewer: PoseViewer
  gui: any
  videoStream: any
  poseNet: any
  activePose: any
  posesDetections: any
  swipe: any

  constructor(tv: TouchlessView, viewer?: PoseViewer) {
    this.tv = tv;
    this.viewer = viewer;
  }

  create() {
    this.gui = new GUI();
    this.posesDetections = this.gui.addFolder('Poses detection')
    this._addVideoStream()
    this._addPoseNet()
    this._addActivePose()
    this._addSwipe()
  }

  private _addVideoStream() {
    const config = { ...this.tv.imageStream.config }
    const update$ = new Subject()
    this.videoStream = this.posesDetections.addFolder('Image Strean')
    this.videoStream.add(config, 'rotate', [-90, 0, 90])
      .onChange(() => { update$.next() })
    this.videoStream.add(config, 'frameRate', this._getSelectArr(6, 30, 2))
      .onChange(() => { update$.next() })
    update$.pipe(
      delay(1000)
    ).subscribe(_ => {
      config.rotate = +config.rotate as 0 | 90 | -90
      config.frameRate = +config.frameRate
      this.viewer ? this.viewer.setConfig() : console.log('PoseViewer is undefined');
    })
  }

  private _addPoseNet() {
    const update$ = new Subject()
    const modelConfig = { ...this.tv.poseNet.modelConfig }
    const inferenceConfig = { ...this.tv.poseNet.inferenceConfig }
    this.poseNet = this.posesDetections.addFolder('PoseNet')
    this.poseNet.add(modelConfig, 'architecture', ['MobileNetV1', 'ResNet50'])
      .onChange(() => { update$.next() });
    this.poseNet.add(modelConfig, 'outputStride', this._getSelectArr(8, 32, 8))
      .onChange(() => { update$.next() });
    this.poseNet.add(modelConfig, 'inputResolution', this._getSelectArr(200, 800, 50))
      .onChange(() => { update$.next() });
    this.poseNet.add(inferenceConfig, 'maxDetections', 1, 20, 1)
      .onChange(() => { update$.next() });
    this.poseNet.add(inferenceConfig, 'scoreThreshold', 0.1, 0.9, 0.01)
      .onChange(() => { update$.next() });
    this.poseNet.add(inferenceConfig, 'nmsRadius', 0, 40, 1)
      .onChange(() => { update$.next() });
    update$.pipe(
      delay(1000)
    ).subscribe(_ => {
      modelConfig.outputStride = +modelConfig.outputStride as PoseNetOutputStride
      modelConfig.inputResolution = +modelConfig.inputResolution
      this.tv.poseNet.setConfig({
        modelConfig: { ...modelConfig },
        inferenceConfig: { ...inferenceConfig }
      }
      )
    })
  }

  private _addActivePose() {
    const update$ = new Subject()
    const scene = { ...this.tv.activePose.config.scene }
    const pose = { ...this.tv.activePose.config.pose }
    this.activePose = this.gui.addFolder('ActivePose')
    this.activePose.add(scene, 'center', 0, scene.width, 1)
      .onChange(() => { update$.next() });
    this.activePose.add(scene, 'passiveLeft', 0, scene.width, 1)
      .onChange(() => { update$.next() });
    this.activePose.add(scene, 'passiveRight', 0, scene.width, 1)
      .onChange(() => { update$.next() });
    this.activePose.add(pose, 'minScore', 0, 0.9, 0.01)
      .onChange(() => { update$.next() });
    this.activePose.add(pose, 'minShoulderDist', 0, scene.width, 1)
      .onChange(() => { update$.next() });
    update$.subscribe(_ => this.tv.activePose.setConfig({
      scene: { ...scene },
      pose: { ...pose }
    }))
  }

  private _addSwipe() {
    this.swipe = this.gui.addFolder('Swipe Settings')
  }

  private _getSelectArr(start: number, end?: number, step?: number): object {
    let arr = [];
    for (let i = start; i <= end; i += step) arr.push(i)
    return arr
  }
}