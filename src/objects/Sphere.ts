import nj from "numjs";
import p5Types from "p5";
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
  // meridiansBegin: number[]
  // meridiansEnd: number[]
  vertices: number[][][];
  faces: number[][][];
  updateData: (data: UpdateSphereType) => void;
  drawVertices: (p5: p5Types) => void;
  drawEdges: (p5: p5Types) => void;
  drawFaces: (p5: p5Types) => void;
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
};

type UpdateSphereType = {
  meridians?: number;
  parallels?: number;
  radius?: number;
  name?: string;
  color?: string;
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

  constructor({
    meridians,
    parallels,
    radius,
    name,
    color,
    center = [0, 0, 0],
  }: SphereConstructorType) {
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

  public drawVertices(p5: p5Types) {
    const flattenVertices = this.vertices.flat();

    p5.push();
    p5.stroke("yellow");
    p5.strokeWeight(5);

    p5.point(this.meridiansEnd[0], this.meridiansEnd[1], this.meridiansEnd[2]);
    flattenVertices.forEach((vertex: number[]) => {
      p5.point(vertex[0], vertex[1], vertex[2]);
    });
    p5.point(
      this.meridiansBegin[0],
      this.meridiansBegin[1],
      this.meridiansBegin[2]
    );
    p5.pop();
  }

  public drawFaces(p5: p5Types) {
    p5.push();

    p5.noStroke();
    p5.stroke("black");
    p5.strokeWeight(1);
    p5.fill(this.color);

    this.faces.forEach((face: number[][]) => {
      p5.beginShape();
      face.forEach((vertexIdx: number[]) => {
        p5.vertex(
          this.vertices[vertexIdx[0]][vertexIdx[1]][0],
          this.vertices[vertexIdx[0]][vertexIdx[1]][1],
          this.vertices[vertexIdx[0]][vertexIdx[1]][2]
        );
      });
      p5.endShape(p5.CLOSE);
    });

    p5.pop();
  }

  public drawEdges(p5: p5Types) {
    const extremes = [this.meridiansEnd, this.meridiansBegin];
    for (let i = 0; i < 2; i++) {
      const currentParallel = this.vertices[i * (this.parallelsAmount - 1)];

      p5.push();
      p5.stroke(this.color);
      currentParallel.forEach((currrentPoint: number[]) => {
        p5.line(
          currrentPoint[0],
          currrentPoint[1],
          currrentPoint[2],
          extremes[i][0],
          extremes[i][1],
          extremes[i][2]
        );
      });
    }
    this.vertices.forEach((line: any, i: number) => {
      line.forEach((point: [number, number, number], j: number) => {
        const nextParallelPoint: any =
          this.vertices[i][(j + 1) % this.meridiansAmout];
        const nextMeridianPoint: any =
          i === this.parallelsAmount - 1
            ? this.vertices[i][j]
            : this.vertices[i + 1][j];

        p5.line(
          ...point,
          nextParallelPoint[0],
          nextParallelPoint[1],
          nextParallelPoint[2]
        );
        p5.line(
          nextMeridianPoint[0],
          nextMeridianPoint[1],
          nextMeridianPoint[2],
          ...point
        );
      });
    });
    p5.pop();
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
  }: UpdateSphereType) {
    this.radius = radius || this.radius;
    this.parallelsAmount = parallels || this.parallelsAmount;
    this.meridiansAmout = meridians || this.meridiansAmout;
    this.name = name || this.name;
    this.color = color || this.color;

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
  }
}
