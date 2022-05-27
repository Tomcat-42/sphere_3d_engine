export const oneColorVert = `
/*
vert file and comments from adam ferriss
https://github.com/aferriss/p5jsShaderExamples
with additional comments from Louise Lessel
*/ 


// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision mediump float;
#endif


// This “vec3 aPosition” is a built in shader functionality. You must keep that naming.
// It automatically gets the position of every vertex on your canvas

attribute vec3 aPosition;

// We always must do at least one thing in the vertex shader:
// tell the pixel where on the screen it lives:

void main() {
  // copy the position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  
  // Make sure the shader covers the entire screen:
  // scale the rect by two, and move it to the center of the screen
  // if we don't do this, it will appear with its bottom left corner in the center of the sketch
  // try commenting this line out to see what happens
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  // Send the vertex information on to the fragment shader
  // this is done automatically, as long as you put it into the built in shader function “gl_Position”
  gl_Position = positionVec4;
}
`;

export const oneColorFrag = `
// Adapted by Louise Lessel - 2019
// from
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com
// https://thebookofshaders.com/02/


/*
Example:
 Color the entire background blue
*/

// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision mediump float;
#endif

void main() {
    // A blue color
    // In shaders, the RGB color spectrum goes from 0 - 1 instead of 0 - 255
    vec3 color = vec3(0.0, 0.0, 1.0);

    // gl_FragColor is a built in shader variable, and you .frag file must contain it
    // We are setting the vec3 color into a new vec4, with an transparency of 1 (no opacity)
    gl_FragColor = vec4(color, 1.0);
}
`;
