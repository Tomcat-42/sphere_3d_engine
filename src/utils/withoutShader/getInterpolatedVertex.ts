import p5Types from "p5";
import { normalCalc } from "../normalCalc";

export const getInterpolatedVertex = (
  currentFaceIdxs: number[][],
  vertices: number[][][],
  faces: number[][][],
  idx: number,
  parallelsAmount: number,
  meridiansAmount: number,
  p5: p5Types
) => {
  const finalArray = p5.createVector(0, 0, 0);
  
  // if (currentFaceIdxs.length === 3)
  //   for (let i = 0; i < meridiansAmount; i++) {
  //     const currentFaceIdx = faces[i % meridiansAmount];
  //     const face = [
  //       vertices[currentFaceIdx[0][0]][currentFaceIdx[0][1]],
  //       vertices[currentFaceIdx[1][0]][currentFaceIdx[1][1]],
  //       vertices[currentFaceIdx[2][0]][currentFaceIdx[2][1]],
  //     ];
  //     const faceNormal = normalCalc(face, p5);
  //     finalArray.add(faceNormal);
  //   }
  
    return finalArray.normalize().array();
};
