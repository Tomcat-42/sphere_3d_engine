type PointType = {
  x: number;
  y: number;
  z: number;
};

//generate points for a cube using center point and square size
export const generateCube = (
  squareSize: number,
  center: PointType
): number[][][] => {
  const halfSquareSize = squareSize / 2;
  const cube: number[][][] = [];

  //front face
  cube.push([
    [
      center.x - halfSquareSize,
      center.y + halfSquareSize,
      center.z + halfSquareSize,
      1,
    ],
    [
      center.x - halfSquareSize,
      center.y - halfSquareSize,
      center.z + halfSquareSize,
      1,
    ],
    [
      center.x + halfSquareSize,
      center.y - halfSquareSize,
      center.z + halfSquareSize,
      1,
    ],
    [
      center.x + halfSquareSize,
      center.y + halfSquareSize,
      center.z + halfSquareSize,
      1,
    ],
  ]);

  //back face
  cube.push([
    [
      center.x - halfSquareSize,
      center.y + halfSquareSize,
      center.z - halfSquareSize,
      1,
    ],
    [
      center.x + halfSquareSize,
      center.y + halfSquareSize,
      center.z - halfSquareSize,
      1,
    ],
    [
      center.x + halfSquareSize,
      center.y - halfSquareSize,
      center.z - halfSquareSize,
      1,
    ],
    [
      center.x - halfSquareSize,
      center.y - halfSquareSize,
      center.z - halfSquareSize,
      1,
    ],
  ]);

  // right face
  cube.push([
    [
      center.x + halfSquareSize,
      center.y + halfSquareSize,
      center.z + halfSquareSize,
      1,
    ],
    [
      center.x + halfSquareSize,
      center.y - halfSquareSize,
      center.z + halfSquareSize,
      1,
    ],
    [
      center.x + halfSquareSize,
      center.y - halfSquareSize,
      center.z - halfSquareSize,
      1,
    ],
    [
      center.x + halfSquareSize,
      center.y + halfSquareSize,
      center.z - halfSquareSize,
      1,
    ],
  ]);

  // left face
  cube.push([
    [
      center.x - halfSquareSize,
      center.y + halfSquareSize,
      center.z + halfSquareSize,
      1,
    ],
    [
      center.x - halfSquareSize,
      center.y + halfSquareSize,
      center.z - halfSquareSize,
      1,
    ],
    [
      center.x - halfSquareSize,
      center.y - halfSquareSize,
      center.z - halfSquareSize,
      1,
    ],
    [
      center.x - halfSquareSize,
      center.y - halfSquareSize,
      center.z + halfSquareSize,
      1,
    ],
  ]);

  // top face
  cube.push([
    [
      center.x - halfSquareSize,
      center.y - halfSquareSize,
      center.z + halfSquareSize,
      1,
    ],
    [
      center.x - halfSquareSize,
      center.y - halfSquareSize,
      center.z - halfSquareSize,
      1,
    ],
    [
      center.x + halfSquareSize,
      center.y - halfSquareSize,
      center.z - halfSquareSize,
      1,
    ],
    [
      center.x + halfSquareSize,
      center.y - halfSquareSize,
      center.z + halfSquareSize,
      1,
    ],
  ]);

  // bottom face
  cube.push([
    [
      center.x - halfSquareSize,
      center.y + halfSquareSize,
      center.z + halfSquareSize,
      1,
    ],
    [
      center.x + halfSquareSize,
      center.y + halfSquareSize,
      center.z + halfSquareSize,
      1,
    ],
    [
      center.x + halfSquareSize,
      center.y + halfSquareSize,
      center.z - halfSquareSize,
      1,
    ],
    [
      center.x - halfSquareSize,
      center.y + halfSquareSize,
      center.z - halfSquareSize,
      1,
    ],
  ]);

  return cube;
};
