import Sketch from "react-p5";
import p5Types from "p5";
import { useEffect, useState } from "react";
// import { oneColorFrag, oneColorVert } from "./test";

export const ShaderTest = () => {
  const [myRect, setMyRect] = useState<p5Types.Graphics>(
    {} as p5Types.Graphics
  );
  const [width, setWidth] = useState<number>(window.innerWidth - 6);
  const [height, setHeight] = useState<number>(window.innerHeight - 6);

  useEffect(() => {
    console.log("myRect", myRect);
  }, [myRect]);

  const windowResized = (p5: p5Types) => {
    const element = document.getElementById("shaderCanvas");
    setWidth(element?.clientWidth ? element?.clientWidth - 6 : width);
    setHeight(element?.clientHeight ? element?.clientHeight - 6 : height);
    p5.resizeCanvas(width, height);
  };

  const setup = (p5: p5Types) => {
    p5.createCanvas(width, height, p5.WEBGL).parent("shaderCanvas");

    const _myRect = p5.createGraphics(50, 50, p5.WEBGL);
    setMyRect(_myRect);
    // shader = p5.createShader(oneColorVert, oneColorFrag);

    p5.background(0);
    p5.noStroke();
  };

  const draw = (p5: p5Types) => {
    // shader() sets the active shader with our shader
    // p5.shader(shader);

    // rect gives us some geometry on the screen
    p5.rect(0, 0, 50, 50);
    myRect.background(51);
    // myRect.noFill();
    // myRect.stroke(255);
    // myRect.ellipse(p5.mouseX - 150, p5.mouseY - 75, 60, 60);
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
