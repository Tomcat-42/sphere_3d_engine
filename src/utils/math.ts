import * as math from "mathjs";
import p5Types from "p5";
import { Camera } from "../objects/Camera";

export const degreesToRaians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

export const getCentroid = (face: number[][]): number[] => {
  const x = [
    Math.min(...face.map(([x]) => x)),
    Math.max(...face.map(([x]) => x)),
  ];
  const y = [
    Math.min(...face.map(([, y]) => y)),
    Math.max(...face.map(([, y]) => y)),
  ];
  const z = [
    Math.min(...face.map(([, , z]) => z)),
    Math.max(...face.map(([, , z]) => z)),
  ];

  return [(x[1] + x[0]) / 2, (y[1] + y[0]) / 2, (z[1] + z[0]) / 2];
};

export const normalCalc = (face: number[][], p5: p5Types): p5Types.Vector => {
  const p1 = p5.createVector(...face[0]);
  const p2 = p5.createVector(...face[1]);
  const p3 = p5.createVector(...face[2]);

  return p3.sub(p2).cross(p1.sub(p2)).normalize();
};

export const multiplySceneMetrices = (
  camera: Camera,
  face: number[][]
): math.Matrix => {
  const concatenedPipeMatrices = camera.getConcatenatedMatrix();

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
