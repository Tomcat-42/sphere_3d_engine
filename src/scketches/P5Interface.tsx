import p5Types from "p5";
import Sketch from "react-p5";
import { DirectionEnum } from "../constants";
import { useSceneContext } from "../contexts/Scene";
import { Camera } from "../objects/Camera";
import { drawAxonometricFace } from "../utils/drawAxonometricFace";
import { drawPerspectiveFace } from "../utils/drawPerspectiveFace";
import { generateCube } from "../utils/generateSquare";

export const P5Interface = () => {
  const {
    sceneObjects,
    myCamera,
    setMyCamera,
    selectedSphereId,
    drawMode,
    drawModeEnum,
    setCameraVrpInterface,
    cameraVrpInterface,
    camP,
    windowSize,
    camNear,
    camFar,
  } = useSceneContext();
  let canvasSize: number[] = [
    document.getElementById("mainCanvas")?.clientWidth || 0,
    document.getElementById("mainCanvas")?.clientHeight || 0,
  ];
  // let shader: p5Types.Shader;

  const windowResized = (p5: p5Types) => {
    const element = document.getElementById("mainCanvas");
    const size = [
      element?.clientWidth || window.innerWidth,
      element?.clientHeight || window.innerHeight,
    ];
    p5.resizeCanvas(size[0], size[1]);
    canvasSize = size;
    // shader?.setUniform("uScreenSize", size);
  };

  const colorsByIdx = [
    [Math.random(), Math.random(), Math.random()],
    [Math.random(), Math.random(), Math.random()],
    [Math.random(), Math.random(), Math.random()],
    [Math.random(), Math.random(), Math.random()],
    [Math.random(), Math.random(), Math.random()],
    [Math.random(), Math.random(), Math.random()],
  ];

  const cubes = [
    generateCube(50, { x: 0, y: 0, z: -65 }),
    generateCube(25, { x: 0, y: 0, z: 0 }),
  ];

  const setup = (p5: p5Types, parent: Element) => {
    const element = document.getElementById("mainCanvas");
    const initialSize = [
      element?.clientWidth || window.innerWidth,
      element?.clientHeight || window.innerHeight,
    ];
    canvasSize = initialSize;
    setMyCamera(
      new Camera({
        camPosition: cameraVrpInterface,
        p5,
        p: camP,
        screenDimensions: canvasSize,
        window: windowSize,
        near: camNear,
        far: camFar,
      })
    );

    p5.createCanvas(initialSize[0], initialSize[1], p5.WEBGL).parent(
      "mainCanvas"
    );

    // shader = p5.createShader(oneColorVert, oneColorFrag);
    // p5.shader(shader);

    p5.debugMode(p5.AXES);
    // p5.noStroke();
  };

  const moveCamera = (camera: Camera, keyCode: number) => {
    if (keyCode === DirectionEnum.front) camera.updateVrp(-5, "z");
    if (keyCode === DirectionEnum.back) camera.updateVrp(5, "z");

    if (keyCode === DirectionEnum.up) camera.updateVrp(5, "y");
    if (keyCode === DirectionEnum.down) camera.updateVrp(-5, "y");

    if (keyCode === DirectionEnum.left) camera.updateVrp(-5, "x");
    if (keyCode === DirectionEnum.right) camera.updateVrp(5, "x");

    setCameraVrpInterface(myCamera.vrp);
  };

  const draw = (p5: p5Types) => {
    p5.background(40);

    if (p5.keyIsPressed) moveCamera(myCamera, p5.keyCode);

    sceneObjects.forEach((sphere) => {
      const distance = p5
        .createVector(...sphere.center)
        .dist(p5.createVector(...myCamera.vrp));

      if (distance < myCamera.near || distance > myCamera.far) return;

      sphere.faces.forEach((sphereFace) => {
        const face: number[][] = [];

        sphereFace.forEach((vertexIdx: number[]) =>
          face.push(sphere.vertices[vertexIdx[0]][vertexIdx[1]])
        );

        if (drawMode === drawModeEnum.perspective)
          drawPerspectiveFace(myCamera, face, sphere.color, p5);
        else drawAxonometricFace(p5, face, sphere.color, myCamera);
      });
    });

    // cubes.forEach((cube) => {
    //   cube.forEach((face: number[][], idx: number) => {
    //     shader.setUniform("uColor", colorsByIdx[idx]);

    //     if (drawMode === drawModeEnum.perspective)
    //       drawPerspectiveFace(myCamera, face, p5);
    //     else drawAxonometricFace(p5, face, myCamera);
    //   });
    // });
  };

  return <Sketch setup={setup} windowResized={windowResized} draw={draw} />;
};
