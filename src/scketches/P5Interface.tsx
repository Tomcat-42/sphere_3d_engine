import p5Types from "p5";
import Sketch from "react-p5";
import { DirectionEnum } from "../constants";
import { useSceneContext } from "../contexts/Scene";
import { Camera } from "../objects/Camera";
import { Light } from "../objects/Light";
import { GT } from "../utils/GT";
import { pipe } from "../utils/pipe";
import { drawAxonometricFace } from "../utils/withoutShader/drawAxonometricFace";
import { drawPerspectiveFace } from "../utils/withoutShader/drawPerspectiveFace";

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
    projectionPlanDistance,
    setLocalViewportSize,
    viewUp,
    setViewportSize,
    projectionType,
  } = useSceneContext();

  const windowResized = (p5: p5Types) => {
    const element = document.getElementById("mainCanvas");
    const size = [
      element?.clientWidth || window.innerWidth,
      element?.clientHeight || window.innerHeight,
    ];
    p5.resizeCanvas(size[0], size[1]);
    setViewportSize({
      width: [-size[0] / 2, size[0] / 2],
      height: [-size[1] / 2, size[1] / 2],
    });
  };

  const setup = (p5: p5Types, parent: Element) => {
    const element = document.getElementById("mainCanvas");
    const initialSize = [
      element?.clientWidth || window.innerWidth,
      element?.clientHeight || window.innerHeight,
    ];
    setLocalViewportSize({
      width: [-initialSize[0] / 2, initialSize[0] / 2],
      height: [-initialSize[1] / 2, initialSize[1] / 2],
    });
    setMyCamera(
      new Camera({
        camPosition: cameraVrpInterface,
        p5,
        p: camP,
        viewport: {
          width: [-initialSize[0] / 2, initialSize[0] / 2],
          height: [-initialSize[1] / 2, initialSize[1] / 2],
        },
        viewUp,
        window: windowSize,
        near: camNear,
        far: camFar,
        projectionPlanDistance,
        projectionType: drawMode,
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

    p5.debugMode(p5.AXES);
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
    p5.background(0);

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
        .createVector(...myCamera.nVector)
        .dot(
          p5
            .createVector(...myCamera.vrp)
            .sub(p5.createVector(...sphere.center))
        );

      if (distance < myCamera.near || distance > myCamera.far) return;

      sphere.faces.forEach((sphereFace) => {
        const face: number[][] = [];

        sphereFace.forEach((vertexIdx: number[]) =>
          face.push(sphere.vertices[vertexIdx[0]][vertexIdx[1]])
        );
        const color = light.getFaceColor(
          face,
          myCamera.vrp,
          sphere.Ka,
          sphere.Kd,
          sphere.Ks,
          2,
          p5
        );
        const isSelected = selectedSphereId === sphere.id;
        if (drawMode === drawModeEnum.perspective)
          drawPerspectiveFace(myCamera, face, color, isSelected, p5);
        else drawAxonometricFace(p5, face, color, isSelected, myCamera);
      });
    });
  };

  return <Sketch setup={setup} windowResized={windowResized} draw={draw} />;
};
