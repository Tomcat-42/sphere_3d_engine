import nj from "numjs";

export const degreesToRaians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

export const normalizeVector = (vector: number[]) => {
  return nj
    .array(vector)
    .divide(
      Math.sqrt(
        Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2)
      )
    )
    .tolist();
};
