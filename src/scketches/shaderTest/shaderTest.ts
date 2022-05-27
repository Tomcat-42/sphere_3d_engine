import p5Types from "p5";
import { vertFile, fragFile } from "./shaders";

export const shaderTest = (p5: p5Types) => {
  let theShader: p5Types.Shader;
  let pg: p5Types.Graphics;

  p5.setup = () => {
    // shaders require WEBGL mode to work
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    p5.noStroke();
    pg = p5.createGraphics(100, 100);
    theShader = p5.createShader(vertFile, fragFile);
  };

  p5.draw = () => {
    p5.background(200);
    pg.background(100);
    pg.noStroke();
    pg.ellipse(pg.width / 2, pg.height / 2, 50, 50);
    p5.image(pg, 50, 50);
    p5.image(pg, 0, 0, 50, 50);
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };
};
