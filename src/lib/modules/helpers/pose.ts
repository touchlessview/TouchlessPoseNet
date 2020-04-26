import { Kp, ActivePose, ActiveKeypoint } from '../touchless.types';

export const getKeypointsDistanse = (keypoint1: ActiveKeypoint, keypoint2: ActiveKeypoint) => {
  const kp1 = keypoint1.position;
  const kp2 = keypoint2.position;
  return Math.sqrt(((kp2.x - kp1.x) ** 2) + ((kp2.y - kp1.y) ** 2))
}

export const getKeypointsCenter = (keypoint1: ActiveKeypoint, keypoint2: ActiveKeypoint) => {
  return {
    x: (keypoint1.position.x + keypoint2.position.x) / 2,
    y: (keypoint1.position.y + keypoint2.position.y) / 2,
  }
}

export const getPoseRelativeSize = (pose: ActivePose, minSize: number): number => {
  const keypoints = pose.keypoints;
  return Math.max(
    minSize,
    getKeypointsDistanse(keypoints[Kp.leftShoulder], keypoints[Kp.leftElbow]),
    getKeypointsDistanse(keypoints[Kp.rightShoulder], keypoints[Kp.rightElbow]),
    getKeypointsDistanse(keypoints[Kp.leftShoulder], keypoints[Kp.rightShoulder]),
  )
}

export const isActiveKeypoint = (keypoint: ActiveKeypoint, min: number, max: number, c: 'x' | 'y', minScore: number = 0) => {
  if (
    keypoint.score > minScore &&
    keypoint.position[c] > min &&
    keypoint.position[c] < max
  ) {
    return true
  }
  return false
}

export const reverseKeypoint = (keypoint: ActiveKeypoint, sceneSize: number, ignore: boolean = false): ActiveKeypoint => {
  if (!ignore) {
    const position = {
      x: sceneSize - keypoint.position.x,
      y: keypoint.position.y
    }
    return {...keypoint, position}
  } else return keypoint
}

export const poseSmoothMovement = (
  oldPose: ActivePose,
  newPose: ActivePose,
  addFrames: number,
  callbackStream: (arg: ActivePose) => void,
  complete?: ()=> void
): void => {
  const _old = oldPose.keypoints;
  const _new = newPose.keypoints;
  let isStart = false;
  let iteration = 0;
  let interval = setInterval(() => {
    for (let i = 0; i < 17; i++) {
      const position = {
        x: moveIteration(_old[i].position.x, _new[i].position.x, isStart),
        y: moveIteration(_old[i].position.y, _new[i].position.y, isStart)
      } 
      const keypoint = { ..._old[i], position }
      _old[i] = keypoint;
    }
    isStart = false;
    if (typeof callbackStream === 'function') callbackStream(oldPose)
    if (iteration > addFrames) {
      clearInterval(interval);
      interval = undefined;
      if (typeof complete === 'function') complete()
    } else iteration++
  }, Math.ceil(1000 / addFrames))
}

const moveIteration = (oldVal: number, newVal: number, isStartVal: boolean): number => {
  const distance = Math.abs(newVal - oldVal)
  if (distance < 10 && isStartVal) return oldVal
  if (distance < 2) return newVal
  else {
    const speed = Math.ceil(distance / 5);
    return newVal > oldVal ? oldVal + speed : oldVal - speed
  }
}