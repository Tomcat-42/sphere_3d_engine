export const oneColorVert = `
#ifdef GL_ES
precision mediump float;
#endif

// Transformation matrices
 uniform mat4 uModelViewMatrix;
 uniform mat4 uProjectionMatrix;

uniform vec2 uScreenSize;

attribute vec3 aPosition;
// P5 provides us with texture coordinates for most shapes
attribute vec2 aTexCoord;

// This is a varying variable, which in shader terms means that it will be passed from the vertex shader to the fragment shader
varying vec2 vTexCoord;

void main() {
  // Copy the texcoord attributes into the varying variable
  vTexCoord = aTexCoord;
  
  vec4 normalizedPosition = vec4(aPosition, 1.0);
    
  // doing .xy means we do the same math for both x and y positions

  vec4 viewModelPosition = uModelViewMatrix * normalizedPosition;
  gl_Position = uProjectionMatrix * viewModelPosition;
}
`;

export const oneColorFrag = `
#ifdef GL_ES
precision mediump float;
#endif

// uniform vec3 uColor;

// vetores | pontos
uniform vec4 uFaceNormal;
uniform vec4 uObserver;
uniform vec4 uLightPosition;
uniform vec4 uReferencePoint;

// ratios
uniform vec3 uKa;
uniform vec3 uKd;
uniform vec3 uKs;
uniform float n;
uniform vec3 uIla;
uniform vec3 uIl;

void main()
{
  vec4 N = uFaceNormal;
  vec4 L = uLightPosition - uReferencePoint;
  
  float Fatt = min(
    1.0/distance(
      vec3(uReferencePoint), vec3(uLightPosition)
    ),
    1.0
  );
  
  float itR = 
  (uKa[0] * uIla[0] + Fatt * uIl[0] * (uKd[0] * dot(vec3(N), vec3(L))))/255.0;
  
  float itG = 
  (uKa[1] * uIla[1] + Fatt * uIl[1] * (uKd[1] * dot(vec3(N), vec3(L) )))/255.0;
  
  float itB = 
  (uKa[2] * uIla[2] + Fatt * uIl[2] * (uKd[2] * dot(vec3(N), vec3(L) )))/255.0;
  
  gl_FragColor = vec4(itR, itG, itB, 1.0);
}
`;

// export const oneColorFrag = `
// #ifdef GL_ES
// precision mediump float;
// #endif

// uniform vec3 uColor;

// void main()
// {
//   gl_FragColor = vec4(uColor, 1.0);
// }
// `;
