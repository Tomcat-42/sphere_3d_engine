import p5Types from 'p5';
import { Camera } from '../objects/Camera';

export const normalCalc = (face: number[][], p5: p5Types): p5Types.Vector =>  {
    const p1 = p5.createVector(...face[0]);
    const p2 = p5.createVector(...face[1]);
    const p3 = p5.createVector(...face[2]);

    return p3.sub(p2).cross(p1.sub(p2)).normalize();
}