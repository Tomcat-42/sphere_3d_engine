import p5Types from "p5";
import nj from "numjs";
import { pipe } from "../utils/pipe";

export type CameraConstructorType = {
  position: number[];
  lookingAt?: number[];
  p5: p5Types;
};

// TGx = (25 + (30-25)/2) = 27.5
// TGy = (1 + (10-1)/2) = 5.5
// TGz = (22.5 + (25-22.5)/2) = 23.75
// T(-27.5, -5.5, -23.75)

export class Camera {
  private p5: p5Types;

  private vrp: number[] = [];
  private lookingAt: number[] = [];

  // camera vectors
  private nVector: number[] = [];
  private vVector: number[] = [];
  private uVector: number[] = [];

  public Msrusrc: number[][] = nj.zeros([4, 4]).tolist();
  public projectionMatrix: number[][] = nj.zeros([4, 4]).tolist();
  public Mjp: number[][] = nj.zeros([4, 4]).tolist();

  // public fovY: number = 90;
  // public near: number = 0.5;
  // public far: number = 100;

  constructor({ position, lookingAt = [0, 0, 0], p5 }: CameraConstructorType) {
    this.p5 = p5;

    this.generateCanonicalBase(position, lookingAt);
  }

  private generateCanonicalBase(position: number[], lookingAt: number[]) {
    const p5 = this.p5;

    this.vrp = position;
    this.lookingAt = lookingAt;
    this.nVector = this.defineNVector(this.vrp, lookingAt);
    this.vVector = this.defineVVector();
    this.uVector = this.defineUVector();

    this.setMsrusrc();
    this.setProjectionMatrix();
    this.setMjp(0, p5.width, 0, p5.height, 0, p5.height, 0, p5.width);
  }

  private defineNVector(vrp: number[], lookingAt: number[]): number[] {
    const p5 = this.p5;
    return p5
      .createVector(...vrp)
      .sub(p5.createVector(...lookingAt))
      .normalize()
      .array();
  }

  private defineVVector(): number[] {
    const p5 = this.p5;

    const YVector = p5.createVector(0, 1, 0);
    const viewDirectionVector = p5.createVector(...this.nVector);
    return YVector.sub(
      viewDirectionVector.mult(YVector.dot(viewDirectionVector))
    )
      .normalize()
      .array();
  }

  private defineUVector(): number[] {
    const p5 = this.p5;
    return p5
      .createVector(...this.vVector)
      .cross(p5.createVector(...this.nVector))
      .array();
  }

  private setMsrusrc(): number[][] {
    const p5 = this.p5;
    const negativeVrp = p5.createVector(...this.vrp).mult(-1);
    const Msrusrc = [
      [...this.uVector, negativeVrp.dot(p5.createVector(...this.uVector))],
      [...this.vVector, negativeVrp.dot(p5.createVector(...this.vVector))],
      [...this.nVector, negativeVrp.dot(p5.createVector(...this.nVector))],
      [0, 0, 0, 1],
    ];

    this.Msrusrc = Msrusrc;

    return Msrusrc;
  }

  private setProjectionMatrix(): number[][] {
    const p5 = this.p5;

    const dp = p5
      .createVector(...this.vrp)
      .dist(p5.createVector(...this.lookingAt));
    const zvp = -dp;

    const projectionMatrix = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, -zvp / dp, 0],
      [0, 0, -1 / dp, 0],
    ];
    this.projectionMatrix = projectionMatrix;

    return projectionMatrix;
  }

  private setMjp(
    uMin: number,
    uMax: number,
    vMin: number,
    vMax: number,
    yMin: number,
    yMax: number,
    xMin: number,
    xMax: number
  ): number[][] {
    const Mjp = [
      [
        (uMax - uMin) / (xMax - xMin),
        0,
        0,
        -xMin * ((uMax - uMin) / (xMax - xMin)) + uMin,
      ],
      [
        0,
        (vMin - vMax) / (yMax - yMin),
        0,
        yMin * ((vMax - vMin) / (yMax - yMin)) + vMax,
      ],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    this.Mjp = Mjp;

    return Mjp;
  }

  public updateVrp(ratio: number, axis: string) {
    if (axis === "x") this.vrp[0] += ratio;
    if (axis === "y") this.vrp[1] += ratio;
    if (axis === "z") this.vrp[2] += ratio;

    this.generateCanonicalBase(this.vrp, this.lookingAt);
  }

  public updateLookingAt(x: number, y: number) {
    console.debug("lookingAt: ", this.lookingAt);

    this.lookingAt[0] = this.lookingAt[0] + x;
    this.lookingAt[1] = this.lookingAt[1] + y;

    console.debug("newLookingAt: ", this.lookingAt);

    this.generateCanonicalBase(this.vrp, this.lookingAt);
  }
}
