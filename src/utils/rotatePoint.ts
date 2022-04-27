import nj from 'numjs'

const degreesToRaians = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

export const rotatePoint = (
  angle: number,
  x: number,
  y: number,
  z: number,
  axis: string,
): number[] => {
  const angleInRadians = degreesToRaians(angle)
  const zRot = nj.array([
    [
      Math.cos(angleInRadians),
      -Math.sin(angleInRadians),
      0,
    ],
    [Math.sin(angleInRadians), Math.cos(angleInRadians), 0],
    [0, 0, 1],
  ])

  const xRot = nj.array([
    [1, 0, 0],
    [
      0,
      Math.cos(angleInRadians),
      -Math.sin(angleInRadians),
    ],
    [0, Math.sin(angleInRadians), Math.cos(angleInRadians)],
  ])

  const yRot = nj.array([
    [Math.cos(angleInRadians), 0, Math.sin(angleInRadians)],
    [0, 1, 0],
    [
      -Math.sin(angleInRadians),
      0,
      Math.cos(angleInRadians),
    ],
  ])

  if (axis === 'x') {
    return nj.dot(xRot, nj.array<any>([x, y, z])).tolist()
  } else if (axis === 'y') {
    return nj.dot(yRot, nj.array<any>([x, y, z])).tolist()
  } else if (axis === 'z') {
    return nj.dot(zRot, nj.array<any>([x, y, z])).tolist()
  }
  throw new Error('Invalid axis')
}
