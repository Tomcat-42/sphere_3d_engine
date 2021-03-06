import nj from "numjs";
import { v4 } from "uuid";
import { GT } from "../utils/GT";

const moveCenter = (
  _: SphereType,
  __: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: number[]) {
    const self = this as SphereType;
    const referenceCenter = self.center; //move center to prevent displacement
    self.translate(
      -referenceCenter[0],
      -referenceCenter[1],
      -referenceCenter[2]
    );
    originalMethod.apply(this, args);
    self.translate(referenceCenter[0], referenceCenter[1], referenceCenter[2]);
  };
};

export type SphereType = {
  meridiansAmout: number;
  parallelsAmount: number;
  radius: number;
  center: number[];
  readonly id: string;
  name: string;
  color: string;
  Ka: number[];
  Kd: number[];
  Ks: number[];
  n: number;
  vertices: number[][][];
  faces: number[][][];
  updateData: (data: UpdateSphereType) => void;
  translate: (dx: number, dy: number, dz: number) => void;
  scale: (sx: number, sy: number, sz: number) => void;
  rotate: (angle: number, axis: string) => void;
};

export type SphereConstructorType = {
  meridians: number;
  parallels: number;
  radius: number;
  center: number[];
  name: string;
  color: string;
  Ka: number[];
  Kd: number[];
  Ks: number[];
  n: number;
};

type UpdateSphereType = {
  meridians?: number;
  parallels?: number;
  radius?: number;
  name?: string;
  color?: string;
  Ka?: number[];
  Kd?: number[];
  Ks?: number[];
  n?: number;
};

export class Sphere {
  public meridiansAmout: number;
  public parallelsAmount: number;
  public radius: number;
  public center: number[];
  readonly id: string;
  public name: string;
  public color: string;
  public vertices: number[][][];
  public faces: number[][][] = [];

  private meridiansBegin: number[];
  private meridiansEnd: number[];

  public Ka: number[];
  public Kd: number[];
  public Ks: number[];
  public n: number;

  constructor({
    meridians,
    parallels,
    radius,
    name,
    color,
    center = [0, 0, 0],
    Ka,
    Kd,
    Ks,
    n,
  }: SphereConstructorType) {
    this.Ka = [...Ka];
    this.Kd = [...Kd];
    this.Ks = [...Ks];
    this.meridiansAmout = meridians;
    this.parallelsAmount = parallels;
    this.radius = radius;
    this.center = [...center, 1];
    this.name = name;
    this.id = v4();
    this.color = color;

    this.meridiansBegin = nj
      .add(nj.array(this.center), nj.array([0.0, -radius, 0.0, 1]))
      .tolist();

    this.meridiansEnd = nj
      .add(nj.array(this.center), nj.array([0.0, radius, 0.0, 1]))
      .tolist();

    // create matrix of vertices
    this.vertices = nj
      .zeros(this.meridiansAmout * (this.parallelsAmount + 2) * 3)
      .reshape(this.parallelsAmount + 2, this.meridiansAmout, 3)
      .tolist();

    this.n = n;

    this.defineVertices();
    this.defineFaces();
  }

  private defineVertices() {
    const angleMeridians = 360 / this.meridiansAmout;
    const angleParallels = 180 / (this.parallelsAmount + 1);

    for (let i = 0; i < this.parallelsAmount + 2; i++) {
      this.vertices[i][0] = GT.rotate(
        -(angleParallels * i),
        [[0, -this.radius, 0, 0]],
        "z"
      )[0];

      for (let j = 1; j < this.meridiansAmout; j++) {
        this.vertices[i][j] = nj
          .add(
            nj.array(
              GT.rotate(
                -(angleMeridians * j),
                [
                  [
                    this.vertices[i][0][0],
                    this.vertices[i][0][1],
                    this.vertices[i][0][2],
                    0,
                  ],
                ],
                "y"
              )[0]
            ),
            nj.array(this.center)
          )
          .tolist();
      }
      // add center after because the original point is used to define the parallels
      this.vertices[i][0] = nj
        .add(nj.array(this.vertices[i][0]), nj.array(this.center))
        .tolist();
    }
  }

  private defineFaces() {
    const faces: number[][][] = [];

    for (let i = 0; i < this.vertices.length - 1; i++) {
      for (let j = 0; j < this.vertices[i].length; j++) {
        if (i === 0) {
          faces.push([
            [i, j],
            [i + 1, j],
            [i + 1, (j + 1) % this.meridiansAmout],
          ]);
          continue;
        } else if (i === this.vertices.length - 2) {
          faces.push([
            [i, j],
            [i + 1, j],
            [i, (j + 1) % this.meridiansAmout],
          ]);
          continue;
        }
        const face = [
          [i, j],
          [i + 1, j],
          [i + 1, (j + 1) % this.meridiansAmout],
          [i, (j + 1) % this.meridiansAmout],
        ];
        faces.push(face);
      }
    }
    this.faces = faces;
  }

  public translate(dx: number, dy: number, dz: number) {
    const [newCenter, newMeridiansBegin, newMeridiansEnd] = GT.translate(
      [this.center, this.meridiansBegin, this.meridiansEnd],
      dx,
      dy,
      dz
    );
    this.center = newCenter;
    this.meridiansBegin = newMeridiansBegin;
    this.meridiansEnd = newMeridiansEnd;

    const flatVertices = GT.translate(this.vertices.flat(), dx, dy, dz);
    this.vertices = nj
      .array(flatVertices)
      .reshape(this.parallelsAmount + 2, this.meridiansAmout, 4)
      .tolist();
  }

  @moveCenter
  public scale(sx: number, sy: number, sz: number) {
    const [newCenter, newMeridiansBegin, newMeridiansEnd] = GT.scale(
      [this.center, this.meridiansBegin, this.meridiansEnd],
      sx,
      sy,
      sz
    );

    this.center = newCenter;
    this.meridiansBegin = newMeridiansBegin;
    this.meridiansEnd = newMeridiansEnd;

    const flatVertices = GT.scale(this.vertices.flat(), sx, sy, sz);
    this.vertices = nj
      .array(flatVertices)
      .reshape(this.parallelsAmount + 2, this.meridiansAmout, 4)
      .tolist();
  }

  @moveCenter
  public rotate(angle: number, axis: string) {
    const [newCenter, newMeridiansBegin, newMeridiansEnd] = GT.rotate(
      angle,
      [this.center, this.meridiansBegin, this.meridiansEnd],
      axis
    );

    this.center = newCenter;
    this.meridiansBegin = newMeridiansBegin;
    this.meridiansEnd = newMeridiansEnd;

    const flatVertices = GT.rotate(angle, this.vertices.flat(), axis);
    this.vertices = nj
      .array(flatVertices)
      .reshape(this.parallelsAmount + 2, this.meridiansAmout, 4)
      .tolist();
  }

  public updateData({
    radius,
    parallels,
    meridians,
    name,
    color,
    Ka,
    Kd,
    Ks,
    n,
  }: UpdateSphereType) {
    const isToReDraw =
      radius !== this.radius ||
      parallels !== this.parallelsAmount ||
      meridians !== this.meridiansAmout;

    this.radius = radius || this.radius;
    this.parallelsAmount = parallels || this.parallelsAmount;
    this.meridiansAmout = meridians || this.meridiansAmout;
    this.name = name || this.name;
    this.color = color || this.color;
    this.Ka = Ka || this.Ka;
    this.Kd = Kd || this.Kd;
    this.Ks = Ks || this.Ks;
    this.n = n || this.n;

    if (!isToReDraw) return;

    this.meridiansBegin = nj
      .add(nj.array(this.center), nj.array([0.0, -this.radius, 0.0, 1]))
      .tolist();

    this.meridiansEnd = nj
      .add(nj.array(this.center), nj.array([0.0, this.radius, 0.0, 1]))
      .tolist();

    this.vertices = nj
      .zeros(this.meridiansAmout * (this.parallelsAmount + 2) * 3)
      .reshape(this.parallelsAmount + 2, this.meridiansAmout, 3)
      .tolist();

    this.defineVertices();
    this.defineFaces();
  }
}
