import * as math from "mathjs";
import p5Types from "p5";
import { drawModeEnum } from "../../contexts/Scene";
import { Camera } from "../../objects/Camera";
import { normalCalc } from "../normalCalc";

export const drawFace = (
  p5: p5Types,
  face: number[][],
  isSelected: boolean,
  camera: Camera,
  drawMode: drawModeEnum
) => {
  const localFace = JSON.parse(JSON.stringify(face));
  const normal = normalCalc(localFace, p5);

  const angle = p5.createVector(...camera.nVector).dot(normal);

  if (angle < 0.00000001) return;

  const concatenedPipeMatrices = camera.getConcatenatedMatrix();

  const pointsMatrix = math.multiply(
    concatenedPipeMatrices,
    math.transpose(math.matrix(face))
  );

  if (drawMode === drawModeEnum.perspective) {
    pointsMatrix.forEach((point, idx, matrix) => {
      const fixedIdx = idx.toString().split(",");
      if (+fixedIdx[0] === 2) return;

      matrix.set(
        [+fixedIdx[0], +fixedIdx[1]],
        point / matrix.get([3, +fixedIdx[1]])
      );
    });
  }

  p5.push();
  if (isSelected) {
    p5.stroke("yellow");
    p5.strokeWeight(1);
  } else p5.strokeWeight(0);

  p5.beginShape();

  for (let i = 0; i < pointsMatrix.size()[1]; i++) {
    const yes = math.subset(pointsMatrix, math.index(math.range(0, 3), i));
    p5.vertex(yes.get([0, 0]), yes.get([1, 0]), yes.get([2, 0]));
  }

  p5.endShape(p5.CLOSE);
  p5.noFill();
  p5.pop();
};
