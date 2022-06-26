import { Camera } from "../objects/Camera";
import * as math from "mathjs";

export const pipe = (camera: Camera, face: number[][]): math.Matrix => {
  const concatenedPipeMatrices = // math.multiply(
    math.multiply(
      math.matrix(camera.Msrusrc),
      math.matrix(camera.projectionMatrix)
    );
  // math.matrix(camera.Mjp)
  // );

  const pointsMatrix = math.multiply(
    concatenedPipeMatrices,
    math.transpose(math.matrix(face))
  );

  pointsMatrix.forEach((point, idx, matrix) => {
    const fixedIdx = idx.toString().split(",");
    if (+fixedIdx[0] === 2) return;

    matrix.set(
      [+fixedIdx[0], +fixedIdx[1]],
      point / matrix.get([3, +fixedIdx[1]])
    );
  });

  return pointsMatrix;
};
