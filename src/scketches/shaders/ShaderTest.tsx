import Sketch from "react-p5";
import p5Types from "p5";
import { useEffect, useState } from "react";
import { oneColorFrag, oneColorVert } from "./";

export const ShaderTest = () => {
  // const [myRect, setMyRect] = useState<p5Types.Graphics>(
  //   {} as p5Types.Graphics
  // );
  const [width, setWidth] = useState<number>(window.innerWidth - 6);
  const [height, setHeight] = useState<number>(window.innerHeight - 6);
  const squareSize = 25;
  let shader: p5Types.Shader;

  const windowResized = (p5: p5Types) => {
    const element = document.getElementById("shaderCanvas");
    setWidth(element?.clientWidth ? element?.clientWidth - 6 : width);
    setHeight(element?.clientHeight ? element?.clientHeight - 6 : height);
    p5.resizeCanvas(width, height);
  };

  const setup = (p5: p5Types) => {
    p5.createCanvas(width, height, p5.WEBGL);
    // .parent("shaderCanvas");

    shader = p5.createShader(oneColorVert, oneColorFrag);
    p5.shader(shader);
  };

  const draw = (p5: p5Types) => {
    p5.background(40);

    p5.rect(0, 0, squareSize, squareSize);

    p5.push();
    shader.setUniform("uColor", [1, 1, 0]);
    shader.setUniform("uScreenSize", [width, height]);

    p5.beginShape();
    //face 1
    p5.vertex(-squareSize, -squareSize);
    p5.vertex(+squareSize, -squareSize);
    p5.vertex(+squareSize, +squareSize);
    p5.vertex(-squareSize, +squareSize);
    p5.endShape(p5.CLOSE);
    p5.pop();
  };

  return (
    <Sketch
      setup={setup}
      windowResized={windowResized}
      draw={draw}
      // preload={preLoad}
    />
  );
};
