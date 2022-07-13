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
    Ka: number[],
    Kd: number[],
    p5: p5Types
  ): number[] {
    const centroid = this.getCentroid(face); // FIXME: Centroid is not correct
    const referencePoint = p5.createVector(face[0][0], face[0][1], face[0][2]);
    // const referencePoint = p5.createVector(
    //   centroid[0],
    //   centroid[1],
    //   centroid[2]
    // );

    // const N = normalCalc([centroid, face[0], face[1]], p5);
    const N = normalCalc(face, p5);
    const L = p5.createVector(...this.position).sub(referencePoint);

    const Fatt = Math.min(
      1 /
        p5.dist(
          face[0][0],
          face[0][1],
          face[0][2],
          this.position[0],
          this.position[1],
          this.position[2]
        ),
      1
    );

    const ItR = Ka[0] * this.Ila[0] + Fatt * this.Il[0] * (Kd[0] * N.dot(L));
    const ItG = Ka[1] * this.Ila[1] + Fatt * this.Il[1] * (Kd[1] * N.dot(L));
    const ItB = Ka[2] * this.Ila[2] + Fatt * this.Il[2] * (Kd[2] * N.dot(L));

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

    return [(x[1] - x[0]) / 2, (y[1] - y[0]) / 2, (z[1] - z[0]) / 2];
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
