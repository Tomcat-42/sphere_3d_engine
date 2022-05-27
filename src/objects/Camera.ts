import nj from "numjs";
// import { degreesToRaians } from "../utils/math";
export type CameraConstructorType = {
  position: number[];
  target?: number[];
};

export class Camera {
  public position: number[];
  private viewDirection: number[];
  public target: number[];
  // public up: number[] = [0, 0, 0];
  // public fovY: number = 90;
  // public vp: number[] = [1200, 800];
  // public near: number = 0.5;
  // public far: number = 100;

  constructor({ position, target = [0, 0, 0] }: CameraConstructorType) {
    this.position = position;
    this.target = target;
    this.viewDirection = nj.array(target).subtract(nj.array(position)).tolist();

    console.log("view direction: ", this.viewDirection);
  }

  // perspective() {
  //   const fn = this.far + this.near;
  //   const f_n = this.far - this.near;
  //   const r = this.vp[0] / this.vp[1];
  //   const t = 1.0 / Math.tan(degreesToRaians(this.fovY) / 2.0);
  //   return [
  //     [t / r, 0.0, 0.0, 0.0],
  //     [0.0, t, 0.0, 0.0],
  //     [0.0, 0.0, -fn / f_n, -1.0],
  //     [0.0, 0.0, (-2.0 * this.far * this.near) / f_n, 0.0],
  //   ];
  // }
}
