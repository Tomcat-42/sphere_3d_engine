import * as math from "mathjs";
import p5Types from "p5";
import { Camera } from "../../objects/Camera";
import { normalCalc } from "../normalCalc";
import { pipe } from "../pipe";

export const drawPerspectiveFace = (
  camera: Camera,
  face: number[][],
  selected: boolean,
  p5: p5Types
) => {
  const localFace = JSON.parse(JSON.stringify(face));
  const normal = normalCalc(localFace, p5);

  const angle = p5.createVector(...camera.nVector).dot(normal);

  if (angle < 0.00000001) return;

  const points = pipe(camera, localFace);

  p5.push();
  if (selected) {
    p5.stroke("yellow");
    p5.strokeWeight(1);
  } else p5.strokeWeight(0);

  p5.beginShape();

  for (let i = 0; i < points.size()[1]; i++) {
    const yes = math.subset(points, math.index(math.range(0, 3), i));
    p5.vertex(yes.get([0, 0]), yes.get([1, 0]), yes.get([2, 0]));
  }

  p5.endShape(p5.CLOSE);
  p5.noFill();
  p5.pop();
};
