import p5Types from "p5";

export const testSketch = (p5: p5Types) => {
  p5.windowResized = () => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  p5.setup = () => {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.frameRate(60);
  };

  p5.draw = () => {
    p5.background("black");
    const dimension = Math.min(window.innerWidth, window.innerHeight);
    p5.ellipse(
      window.innerWidth / 2,
      window.innerHeight / 2,
      (Math.sin(Date.now() / 500) + dimension / 2 / 5) * 5,
      (Math.sin(Date.now() / 500) + dimension / 2 / 5) * 5
    );
  };
};
