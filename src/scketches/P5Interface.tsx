import Sketch from "react-p5";
import p5Types from "p5";
import { Sphere, SphereType } from "../objects/Sphere";
import { useSceneContext } from "../contexts/Scene";
import { Camera } from "../objects/Camera";

export const P5Interface = () => {
  const { sceneObjects, selectedSphereId } = useSceneContext();
  // const myCamera = new Camera({ position: [0, 0, -3] });
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
  };

  const setup = (p5: p5Types) => {
    const element = document.getElementById("mainCanvas");
    p5.createCanvas(
      element?.clientWidth || window.innerWidth,
      element?.clientHeight || window.innerHeight,
      p5.WEBGL
    ).parent("mainCanvas");
    // p5.noLoop()

    p5.frameRate(60);
    p5.debugMode();
    p5.camera(+150, -150, p5.height / 2 / p5.tan(p5.PI / 6), 0, 0, 0, 0, 1, 0);
  };

  const draw = (p5: p5Types) => {
    p5.background("black");
    p5.orbitControl();

    p5.strokeWeight(0.5);
    sceneObjects?.forEach((sphere: SphereType) => {
      sphere.drawEdges(p5);
    });

    // mySphere.drawEdges(p5);
    // mySphere.rotate(0.9, "z");

    if (selectedSphereId) {
      const selectedSphere = sceneObjects?.find(
        (sphere: SphereType) => sphere.id === selectedSphereId
      );
      selectedSphere?.drawVertices(p5);
    }

    //define debug color
    p5.stroke(255, 0, 150);
    p5.strokeWeight(0.5);
  };

  return <Sketch setup={setup} windowResized={windowResized} draw={draw} />;
};
