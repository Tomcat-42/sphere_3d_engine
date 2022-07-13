import p5Types from "p5";
import Sketch from "react-p5";
import { DirectionEnum } from "../constants";
import { useSceneContext } from "../contexts/Scene";
import { Camera } from "../objects/Camera";
import { Light } from "../objects/Light";
import { drawAxonometricFace } from "../utils/drawAxonometricFace";
import { drawPerspectiveFace } from "../utils/drawPerspectiveFace";
import { generateCube } from "../utils/generateSquare";
import { GT } from "../utils/GT";
import { degreesToRaians } from "../utils/math";
import { pipe } from "../utils/pipe";

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
    light,
    setLight,
    lightPosition,
    ambientLightIntensity,
    lightIntensity,
    axisToRotate,
    isToRotateLight,
  } = useSceneContext();
  let canvasSize: number[] = [
    document.getElementById("mainCanvas")?.clientWidth || 0,
    document.getElementById("mainCanvas")?.clientHeight || 0,
  ];
  // let shader: p5Types.Shader;

  // FIXME: Change Camera parameters of viewport
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
    setLight(
      new Light({
        position: lightPosition,
        Ila: ambientLightIntensity,
        Il: lightIntensity,
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

    p5.push();
    if (isToRotateLight)
      light.setPosition(GT.rotate(1, [[...light.position]], axisToRotate)[0]);
    const yes = pipe(myCamera, [[...light.position]]);
    p5.stroke(light.Il[0], light.Il[1], light.Il[2]);
    p5.translate(yes.get([0, 0]), yes.get([1, 0]), yes.get([2, 0]));
    p5.sphere(5);
    p5.noFill();
    p5.pop();

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
        const color = light.getFaceColor(face, sphere.Ka, sphere.Kd, p5);
        // console.debug(color);
        const isSelected = selectedSphereId === sphere.id;
        if (drawMode === drawModeEnum.perspective)
          drawPerspectiveFace(myCamera, face, color, isSelected, p5);
        else drawAxonometricFace(p5, face, color, isSelected, myCamera);
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
