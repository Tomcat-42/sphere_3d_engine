import nj from "numjs";
import { degreesToRaians } from "./math";

export class GT {
  public static rotate(
    angle: number,
    points: number[][],
    axis: string
  ): number[][] {
    const angleInRadians = degreesToRaians(angle);
    const zRot = nj.array([
      [Math.cos(angleInRadians), -Math.sin(angleInRadians), 0, 0],
      [Math.sin(angleInRadians), Math.cos(angleInRadians), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);

    const xRot = nj.array([
      [1, 0, 0, 0],
      [0, Math.cos(angleInRadians), -Math.sin(angleInRadians), 0],
      [0, Math.sin(angleInRadians), Math.cos(angleInRadians), 0],
      [0, 0, 0, 1],
    ]);

    const yRot = nj.array([
      [Math.cos(angleInRadians), 0, Math.sin(angleInRadians), 0],
      [0, 1, 0, 0],
      [-Math.sin(angleInRadians), 0, Math.cos(angleInRadians), 0],
      [0, 0, 0, 1],
    ]);

    if (axis === "x") {
      return points.map((point) => {
        return nj.dot(xRot, nj.array<any>(point)).tolist();
      });
    } else if (axis === "y") {
      return points.map((point) => {
        return nj.dot(yRot, nj.array<any>(point)).tolist();
      });
    } else if (axis === "z") {
      return points.map((point) => {
        return nj.dot(zRot, nj.array<any>(point)).tolist();
      });
    }
    throw new Error("Invalid axis");
  }

  public static translate(
    points: number[][],
    dx: number,
    dy: number,
    dz: number
  ): number[][] {
    const translationMatrix = nj.array([
      [1, 0, 0, dx],
      [0, 1, 0, dy],
      [0, 0, 1, dz],
      [0, 0, 0, 1],
    ]);
    return points.map((point) => {
      return nj.dot(translationMatrix, nj.array<any>(point)).tolist();
    });
  }

  public static scale(points: number[][], sx: number, sy: number, sz: number) {
    const scaleMatrix = nj.array([
      [sx, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, sz, 0],
      [0, 0, 0, 1],
    ]);
    return points.map((point) => {
      return nj.dot(scaleMatrix, nj.array<any>(point)).tolist();
    });
  }
}
