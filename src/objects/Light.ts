import p5Types from "p5";
import { normalCalc } from "../utils/normalCalc";

type LightConstructorType = {
  position: number[];
  Ila: number[];
  Il: number[];
};

export class Light {
  public position: number[];
  public Ila: number[];
  public Il: number[];

  constructor({ position, Ila, Il }: LightConstructorType) {
    this.position = [...position];
    this.Ila = [...Ila];
    this.Il = [...Il];
  }

  public getFaceColor(
    face: number[][],
    observer: number[],
    Ka: number[],
    Kd: number[],
    Ks: number[],
    n: number,
    p5: p5Types
  ): number[] {
    const centroid = this.getCentroid(face);
    const referencePoint = p5.createVector(
      centroid[0],
      centroid[1],
      centroid[2]
    );

    const N = normalCalc([face[1], centroid, face[0]], p5).normalize();
    const L = p5
      .createVector(...this.position)
      .sub(referencePoint.copy())
      .normalize();

    const NdotL = N.dot(L);
    let RdotS = 0.0;

    const minusL = L.copy().mult(-1);

    if (NdotL > 0.00000001) {
      const R = N.copy()
        .mult(minusL.copy().mult(2).dot(N.copy()))
        .sub(minusL.copy())
        .normalize();
      const S = p5
        .createVector(observer[0], observer[1], observer[2])
        .sub(referencePoint)
        .normalize();

      RdotS = R.dot(S);
    }

    const Fatt = 1;

    const ItR =
      Ka[0] * this.Ila[0] +
      Fatt * this.Il[0] * (Kd[0] * NdotL + Ks[0] * Math.pow(RdotS, n));
    const ItG =
      Ka[1] * this.Ila[1] +
      Fatt * this.Il[1] * (Kd[1] * NdotL + Ks[1] * Math.pow(RdotS, n));
    const ItB =
      Ka[2] * this.Ila[2] +
      Fatt * this.Il[2] * (Kd[2] * NdotL + Ks[2] * Math.pow(RdotS, n));

    return [ItR, ItG, ItB];
  }

  getCentroid(face: number[][]): number[] {
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
  }

  setPosition(position: number[]) {
    this.position = [...position];
  }

  setAmbientLightIntensity(Ila: number[]) {
    this.Ila = [...Ila];
  }

  setLightIntensity(Il: number[]) {
    this.Il = [...Il];
  }
}
