import Sketch from "react-p5";
import p5Types from "p5";
import { Sphere } from "../objects/Sphere";
import { useSceneContext } from "../contexts/Scene";
import { Camera } from "../objects/Camera";
import { oneColorFrag, oneColorVert } from "./test/test";
import { DirectionEnum } from "../constants";
import * as math from "mathjs";
import { pipe } from "../utils/pipe";

type mouseCoordinantesType = {
  x: number;
  y: number;
};

export const P5Interface = () => {
  const mouseCoordinantes = { x: 0, y: 0 };
  const { sceneObjects, selectedSphereId } = useSceneContext();
  let shader: p5Types.Shader;
  let myCamera: Camera;
  const squareSize = 25;

  const mySphere = new Sphere({
    meridians: 10,
    parallels: 10,
    radius: 50,
    center: [0, -50, 0],
    color: "#ff0000",
    name: "Felipi",
  });

  const windowResized = (p5: p5Types) => {
    const element = document.getElementById("mainCanvas");
    p5.resizeCanvas(
      element?.clientWidth || window.innerWidth,
      element?.clientHeight || window.innerHeight
    );
    shader?.setUniform("uScreenSize", [p5.width, p5.height]);
  };

  const colorsByIdx = [
    [Math.random(), Math.random(), Math.random()],
    [Math.random(), Math.random(), Math.random()],
    [Math.random(), Math.random(), Math.random()],
    [Math.random(), Math.random(), Math.random()],
    [Math.random(), Math.random(), Math.random()],
    [Math.random(), Math.random(), Math.random()],
  ];

  const shape = [
    [50, 50, -90, 1],
    [100, 50, -90, 1],
    [100, 100, -90, 1],
    [50, 100, -90, 1],
  ];

  const cube = [
    [
      [50, 50, 10, 1],
      [100, 50, 10, 1],
      [100, 100, 10, 1],
      [50, 100, 10, 1],
    ],
    [
      [50, 50, -40, 1],
      [100, 50, -40, 1],
      [100, 100, -40, 1],
      [50, 100, -40, 1],
    ],
    [
      [100, 50, 10, 1],
      [100, 50, -40, 1],
      [100, 100, -40, 1],
      [100, 100, 10, 1],
    ],
    [
      [50, 50, 10, 1],
      [50, 50, -40, 1],
      [50, 100, -40, 1],
      [50, 100, 10, 1],
    ],
    [
      [50, 100, 10, 1],
      [100, 100, 10, 1],
      [100, 100, -40, 1],
      [50, 100, -40, 1],
    ],
    [
      [50, 50, 10, 1],
      [100, 50, 10, 1],
      [100, 50, -40, 1],
      [50, 50, -40, 1],
    ],
  ];

  const setup = (p5: p5Types, parent: Element) => {
    myCamera = new Camera({ position: [0, 0, 50], lookingAt: [0, 0, 30], p5 });
    const element = document.getElementById("mainCanvas");
    p5.createCanvas(
      element?.clientWidth || window.innerWidth,
      element?.clientHeight || window.innerHeight,
      p5.WEBGL
    ).parent("mainCanvas");

    shader = p5.createShader(oneColorVert, oneColorFrag);
    p5.shader(shader);

    // p5.frameRate(60);
    p5.debugMode(p5.AXES);
    p5.noStroke();
    // p5.camera(+150, -150, p5.height / 2 / p5.tan(p5.PI / 6), 0, 0, 0, 0, 1, 0);
  };

  const moveCamera = (camera: Camera, keyCode: number) => {
    if (keyCode === DirectionEnum.front) camera.updateVrp(-5, "z");
    if (keyCode === DirectionEnum.back) camera.updateVrp(5, "z");
    if (keyCode === DirectionEnum.left) camera.updateVrp(-5, "x");
    if (keyCode === DirectionEnum.right) camera.updateVrp(5, "x");
  };

  const draw = (p5: p5Types) => {
    p5.background(40);
    p5.circle(0, 0, 1);
    p5.orbitControl();

    if (p5.keyIsPressed) moveCamera(myCamera, p5.keyCode);

    p5.push();

    cube.forEach((face: number[][], idx: number) => {
      shader.setUniform("uColor", colorsByIdx[idx]);

      const points = pipe(myCamera, face);

      p5.beginShape();

      for (let i = 0; i < 4; i++) {
        const yes = math.subset(points, math.index(math.range(0, 3), i));
        p5.vertex(yes.get([0, 0]), yes.get([1, 0]), yes.get([2, 0]));
      }

      p5.endShape(p5.CLOSE);
    });

    p5.pop();

    // p5.strokeWeight(0.5);
    // sceneObjects?.forEach((sphere: SphereType) => {
    //   sphere.drawEdges(p5);
    // });

    // mySphere.drawEdges(p5);
    // mySphere.rotate(0.9, "z");

    // if (selectedSphereId) {
    //   const selectedSphere = sceneObjects?.find(
    //     (sphere: SphereType) => sphere.id === selectedSphereId
    //   );
    //   selectedSphere?.drawVertices(p5);
    // }

    //define debug color
    // p5.stroke(255, 0, 150);
    // p5.strokeWeight(0.5);
  };

  const mouseDragged = (p5: p5Types) => {
    if (!mouseCoordinantes.x && !mouseCoordinantes.y) {
      mouseCoordinantes.x = p5.mouseX;
      mouseCoordinantes.y = p5.mouseY;
    }
    // console.log(mouseCoordinantes);
    // console.debug(p5.mouseX, p5.mouseY);
    // console.debug(
    //   mouseCoordinantes.x - p5.mouseX,
    //   mouseCoordinantes.y - p5.mouseY
    // );

    myCamera.updateLookingAt(
      mouseCoordinantes.x - p5.mouseX,
      mouseCoordinantes.y - p5.mouseY
    );
  };

  return (
    <Sketch
      setup={setup}
      windowResized={windowResized}
      draw={draw}
      mouseClicked={(p5: p5Types) => {
        mouseCoordinantes.x = p5.mouseX;
        mouseCoordinantes.y = p5.mouseY;
      }}
      // mouseDragged={mouseDragged}
    />
  );
};
