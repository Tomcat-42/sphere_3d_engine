import p5Types from "p5";
import nj from "numjs";
import { GT } from "../utils/GT";
import { v4 } from "uuid";

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
  // vertices: number[][][]
  // faces: []
  updateData: (data: UpdateSphereType) => void;
  drawVertices: (p5: p5Types) => void;
  drawEdges: (p5: p5Types) => void;
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
  radius: number;
  center: number[];
  readonly id: string;
  public name: string;
  public color: string;
  private meridiansBegin: number[];
  private meridiansEnd: number[];
  private vertices: number[][][];
  // private faces: []

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
    this.center = center;
    this.name = name;
    this.id = v4();
    this.color = color;

    this.meridiansBegin = nj
      .add(nj.array(center), nj.array([0.0, -radius, 0.0]))
      .tolist();

    this.meridiansEnd = nj
      .add(nj.array(center), nj.array([0.0, radius, 0.0]))
      .tolist();

    // create matrix of vertices
    this.vertices = nj
      .zeros(this.meridiansAmout * this.parallelsAmount * 3)
      .reshape(this.parallelsAmount, this.meridiansAmout, 3)
      .tolist();

    // create matrix of indices for faces
    // this.faces = []
    this.center = center;

    this.defineVertices();
    // this.defineFaces()
  }

  private defineVertices() {
    const angleMeridians = 360 / this.meridiansAmout;
    const angleParallels = 180 / (this.parallelsAmount + 1);

    for (let i = 0; i < this.parallelsAmount; i++) {
      this.vertices[i][0] = GT.rotate(
        -(angleParallels * (i + 1)),
        [[0, this.radius, 0]],
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
      .reshape(this.parallelsAmount, this.meridiansAmout, 3)
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
      .reshape(this.parallelsAmount, this.meridiansAmout, 3)
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
      .reshape(this.parallelsAmount, this.meridiansAmout, 3)
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

    this.meridiansBegin = [
      this.center[0],
      this.center[1] - this.radius,
      this.center[2],
    ];

    this.meridiansEnd = [
      this.center[0],
      this.center[1] + this.radius,
      this.center[2],
    ];

    this.vertices = nj
      .zeros(this.meridiansAmout * this.parallelsAmount * 3)
      .reshape(this.parallelsAmount, this.meridiansAmout, 3)
      .tolist();

    this.defineVertices();
  }
}

// class Sphere:
//     def __init__(self, meridians, parallels, radius, center=np.array([0.0, 0.0, 0.0])):
//         self.meridians_amout = meridians
//         self.parallels_amount = parallels
//         self.radius = radius
//         self.meridians_begin = center + np.array([0.0, radius, 0.0])
//         self.meridians_end = center + np.array([0.0, -radius, 0.0])
//
//         # create matrix of vertices
//         self.vertices = np.zeros(
//             self.meridians_amout * self.parallels_amount * 3
//         ).reshape(self.parallels_amount, self.meridians_amout, 3)
//
//         # create matrix of indices for faces
//         self.faces = [
//             [[] for y in range(self.meridians_amout)]
//             for x in range(self.parallels_amount + 1)
//         ]
//         self.center = center
//
//         self.define_vertices()
//         self.define_faces()
//
//     def define_vertices(self):
//         angle_meridians = 360 / self.meridians_amout
//         angle_parallels = 180 / (self.parallels_amount + 1)
//
//         for i in range(self.parallels_amount):
//             self.vertices[i][0] = rotate_point(
//                 -(angle_parallels * (i + 1)), 0, self.radius, 0, "z"
//             )
//             for j in range(1, self.meridians_amout):
//                 self.vertices[i][j] = (
//                     rotate_point(
//                         -(angle_meridians * j),
//                         self.vertices[i][0][0],
//                         self.vertices[i][0][1],
//                         self.vertices[i][0][2],
//                         "y",
//                     )
//                     + self.center
//                 )
//
//             # add center after because the original point is used to define the parallels
//             self.vertices[i - 1][0] = self.vertices[i - 1][0] + self.center
//
//     def define_faces(self):
//         # make all the triangular faces
//         for i in range(2):
//             for j in range(self.meridians_amout):
//                 face_vertices = []
//                 face_vertices.append({"i": i * (self.parallels_amount - 1), "j": j})
//                 face_vertices.append(
//                     {
//                         "i": i * (self.parallels_amount - 1),
//                         "j": (j + 1) % self.meridians_amout,
//                     }
//                 )
//                 self.faces[i * self.parallels_amount][j] = face_vertices
//
//         # make all the quad faces
//         for i in range(self.parallels_amount - 1):
//             for j in range(self.meridians_amout):
//                 face_vertices = []
//                 face_vertices.append({"i": i, "j": j})
//                 face_vertices.append({"i": i, "j": (j + 1) % self.meridians_amout})
//                 face_vertices.append({"i": i + 1, "j": j})
//                 face_vertices.append({"i": i + 1, "j": (j + 1) % self.meridians_amout})
//                 # print("face_vertices[", i, "][", j, "]: ", face_vertices)
//                 self.faces[i + 1][j] = face_vertices
//
