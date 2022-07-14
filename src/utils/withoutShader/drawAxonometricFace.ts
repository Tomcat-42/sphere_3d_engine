import * as math from "mathjs";
import p5Types from "p5";
import { Camera } from "../../objects/Camera";
import { normalCalc } from "../normalCalc";

export const drawAxonometricFace = (
  p5: p5Types,
  face: number[][],
  color: number[],
  selected: boolean,
  camera: Camera
) => {
  const localFace: number[][] = JSON.parse(JSON.stringify(face));
  localFace.forEach((point) => point.pop());
  const normal = normalCalc(localFace, p5);

  const angle = p5.createVector(...camera.nVector).dot(normal);

  if (angle < 0.00000001) return;

  const concatenedPipeMatrices = math.multiply(
    math.matrix(camera.Mjp),
    math.matrix(camera.Msrusrc)
  );

  const pointsMatrix = math.multiply(
    concatenedPipeMatrices,
    math.transpose(math.matrix(face))
  );

  p5.push();
  if (selected) {
    p5.stroke("yellow");
    p5.strokeWeight(3);
  } else {
    p5.stroke("black");
    p5.strokeWeight(1);
  }
  p5.fill(color[0], color[1], color[2]);
  p5.beginShape();
  for (let i = 0; i < pointsMatrix.size()[1]; i++) {
    const yes = math.subset(pointsMatrix, math.index(math.range(0, 3), i));
    p5.vertex(yes.get([0, 0]), yes.get([1, 0]), 0);
  }
  p5.endShape(p5.CLOSE);
  p5.noFill();
  p5.pop();
};
