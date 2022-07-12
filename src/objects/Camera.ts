import nj from "numjs";
import p5Types from "p5";

export type WindowType = {
  width: number[];
  height: number[];
};

export type CameraConstructorType = {
  camPosition: number[];
  p5: p5Types;
  p?: number[];
  screenDimensions: number[];
  window: WindowType;
  near: number;
  far: number;
  // projectionPlanDistance: number; TODO: Fazer isso com percentagem (igual na planilha)
};

export class Camera {
  private p5: p5Types;

  public vrp: number[] = [];
  public p: number[] = [0, 0, 0];

  private screenDimensions: number[];

  // camera vectors
  public nVector: number[] = [];
  private vVector: number[] = [];
  private uVector: number[] = [];

  public Msrusrc: number[][] = nj.zeros([4, 4]).tolist();
  public projectionMatrix: number[][] = nj.zeros([4, 4]).tolist();
  public Mjp: number[][] = nj.zeros([4, 4]).tolist();

  public window: WindowType = {} as WindowType;
  public near: number;
  public far: number;

  constructor({
    camPosition,
    p5,
    p = [0, 0, 0],
    screenDimensions,
    window,
    near,
    far,
  }: CameraConstructorType) {
    this.p5 = p5;
    this.window = JSON.parse(JSON.stringify(window));
    this.near = near;
    this.far = far;

    this.screenDimensions = [...screenDimensions];

    this.generateCanonicalBase(camPosition, p);
  }

  private generateCanonicalBase(camPosition: number[], p: number[]) {
    this.vrp = [...camPosition];
    this.p = [...p];
    this.nVector = this.defineNVector(this.vrp, this.p);
    this.vVector = this.defineVVector();
    this.uVector = this.defineUVector();

    this.setMsrusrc();
    this.setProjectionMatrix();
    this.setMjp(
      -(this.screenDimensions[0] - 1) / 2, //por causa do 0 no centro da tela
      (this.screenDimensions[0] - 1) / 2,
      -(this.screenDimensions[1] - 1) / 2,
      (this.screenDimensions[1] - 1) / 2,
      this.window.height[0],
      this.window.height[1],
      this.window.width[0],
      this.window.width[1]
    );
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

    const dp = p5.createVector(...this.vrp).dist(p5.createVector(...this.p));
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

    this.generateCanonicalBase(this.vrp, this.p);
  }

  public setVrp(vrp: number[]) {
    this.vrp = [...vrp];
    this.generateCanonicalBase(this.vrp, this.p);
  }

  public setP(p: number[]) {
    this.p = [...p];
    this.generateCanonicalBase(this.vrp, this.p);
  }

  public setWindow(window: WindowType) {
    this.window = JSON.parse(JSON.stringify(window));
    this.generateCanonicalBase(this.vrp, this.p);
  }

  public setNear(near: number) {
    this.near = near;
  }

  public setFar(far: number) {
    this.far = far;
  }

  public updateP(x: number, y: number, z: number) {
    console.debug("p: ", this.p);

    this.p[0] = this.p[0] + x;
    this.p[1] = this.p[1] + y;

    this.generateCanonicalBase(this.vrp, this.p);
  }
}
