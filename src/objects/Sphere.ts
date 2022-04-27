import p5Types from 'p5'
import nj from 'numjs'
import { rotatePoint } from '../utils/rotatePoint'
import { v4 } from 'uuid'

export type SphereType = {
  meridiansAmout: number
  parallelsAmount: number
  radius: number
  center: number[]
  readonly id: string
  name: string
  color: string
  // meridiansBegin: number[]
  // meridiansEnd: number[]
  // vertices: number[][][]
  // faces: []
  drawVertices: (p5: p5Types) => void
  drawEdges: (p5: p5Types) => void
}

export type SphereConstructorType = {
  meridians: number
  parallels: number
  radius: number
  center: number[]
  name: string
  color: string
}

export class Sphere {
  readonly meridiansAmout: number
  readonly parallelsAmount: number
  readonly radius: number
  readonly center: number[]
  readonly id: string
  public name: string
  public color: string
  private meridiansBegin: number[]
  private meridiansEnd: number[]
  private vertices: number[][][]
  // private faces: []

  constructor({
    meridians,
    parallels,
    radius,
    name,
    color,
    center = [0, 0, 0],
  }: SphereConstructorType) {
    this.meridiansAmout = +meridians
    this.parallelsAmount = +parallels
    this.radius = +radius
    this.center = center
    this.name = name
    this.id = v4()
    this.color = color

    this.meridiansBegin = nj
      .add(nj.array(center), nj.array([0.0, +radius, 0.0]))
      .tolist()

    this.meridiansEnd = nj
      .add(nj.array(center), nj.array([0.0, -+radius, 0.0]))
      .tolist()

    // create matrix of vertices
    this.vertices = nj
      .zeros(this.meridiansAmout * this.parallelsAmount * 3)
      .reshape(this.parallelsAmount, this.meridiansAmout, 3)
      .tolist()

    // create matrix of indices for faces
    // this.faces = []
    this.center = center

    this.defineVertices()
    // this.defineFaces()
  }

  private defineVertices() {
    const angleMeridians = 360 / this.meridiansAmout
    const angleParallels = 180 / (this.parallelsAmount + 1)

    for (let i = 0; i < this.parallelsAmount; i++) {
      this.vertices[i][0] = rotatePoint(
        -(angleParallels * (i + 1)),
        0,
        this.radius,
        0,
        'z',
      )

      for (let j = 1; j < this.meridiansAmout; j++) {
        this.vertices[i][j] = nj
          .add(
            nj.array(
              rotatePoint(
                -(angleMeridians * j),
                this.vertices[i][0][0],
                this.vertices[i][0][1],
                this.vertices[i][0][2],
                'y',
              ),
            ),
            nj.array(this.center),
          )
          .tolist()
      }
      // add center after because the original point is used to define the parallels
      this.vertices[i][0] = nj
        .add(
          nj.array(this.vertices[i][0]),
          nj.array(this.center),
        )
        .tolist()
    }
  }

  public drawVertices(p5: p5Types) {
    const flattenVertices = this.vertices.flat()

    p5.push()
    p5.stroke('yellow')
    p5.strokeWeight(5)

    p5.point(
      this.meridiansBegin[0],
      this.meridiansBegin[1],
      this.meridiansBegin[2],
    )
    flattenVertices.forEach((vertex: number[]) => {
      p5.point(vertex[0], vertex[1], vertex[2])
    })
    p5.point(
      this.meridiansEnd[0],
      this.meridiansEnd[1],
      this.meridiansEnd[2],
    )
    p5.pop()
  }

  public drawEdges(p5: p5Types) {
    const extremes = [
      this.meridiansBegin,
      this.meridiansEnd,
    ]
    for (let i = 0; i < 2; i++) {
      const currentParallel =
        this.vertices[i * (this.parallelsAmount - 1)]

      p5.push()
      p5.stroke(this.color)
      currentParallel.forEach((currrentPoint: number[]) => {
        p5.line(
          currrentPoint[0],
          currrentPoint[1],
          currrentPoint[2],
          extremes[i][0],
          extremes[i][1],
          extremes[i][2],
        )
      })
    }
    this.vertices.forEach((line: any, i: number) => {
      line.forEach(
        (point: [number, number, number], j: number) => {
          const nextParallelPoint: any =
            this.vertices[i][(j + 1) % this.meridiansAmout]
          const nextMeridianPoint: any =
            i === this.parallelsAmount - 1
              ? this.vertices[i][j]
              : this.vertices[i + 1][j]

          p5.line(
            ...point,
            nextParallelPoint[0],
            nextParallelPoint[1],
            nextParallelPoint[2],
          )
          p5.line(
            nextMeridianPoint[0],
            nextMeridianPoint[1],
            nextMeridianPoint[2],
            ...point,
          )
        },
      )
    })
    p5.pop()
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
