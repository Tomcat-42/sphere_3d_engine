export const oneColorVert = `
#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;

// ======================================================= //

// // vetores | pontos
// uniform vec4 uFaceNormal;
// uniform vec4 uObserver;
// uniform vec4 uLightPosition;
// uniform vec4 uReferencePoint;

// // ratios
// uniform vec3 uKa;
// uniform vec3 uKd;
// uniform vec3 uKs;
// uniform float uN;

// uniform vec3 uIla;
// uniform vec3 uIl;

// varying vec3 vFinalColor;

vec3 getLightColor(
  vec3 normal, 
  vec3 lightPosition, 
  vec3 referencePoint, 
  vec3 observerPosition,
  vec3 Ka,
  vec3 Kd,
  vec3 Ks,
  vec3 Ila,
  vec3 Il,
  float n
  ) {
  vec3 N = normalize(normal);
  vec3 L = normalize(lightPosition - referencePoint);
  
  vec3 R = normalize( reflect(-L, N) );
  vec3 S = normalize(observerPosition - referencePoint);
  
  float ndotl = max(dot(N, L), 0.0);
  float rdots = max(dot(R, S), 0.0);
  
  return (Ka * Ila + Il * (Kd * ndotl + Ks * pow(rdots,n)))/255.0;
}

void main() {
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * viewModelPosition;
  
  // vFinalColor = getLightColor(
  //   vec3(uFaceNormal),
  //   vec3(uLightPosition), 
  //   vec3(uReferencePoint),
  //   vec3(uObserver)
  // );
}
`;

export const oneColorFrag = `
#ifdef GL_ES
precision mediump float;
#endif

// vetores | pontos
uniform vec4 uFaceNormal;
uniform vec4 uObserver;
uniform vec4 uLightPosition;
uniform vec4 uReferencePoint;

// ratios
uniform vec3 uKa;
uniform vec3 uKd;
uniform vec3 uKs;
uniform float uN;

uniform vec3 uIla;
uniform vec3 uIl;

// varying vec3 vFinalColor;

vec3 getLightColor(
  vec3 normal, 
  vec3 lightPosition, 
  vec3 referencePoint, 
  vec3 observerPosition,
  vec3 Ka,
  vec3 Kd,
  vec3 Ks,
  vec3 Ila,
  vec3 Il,
  float n
  ) {
  vec3 N = normalize(normal);
  vec3 L = normalize(lightPosition - referencePoint);
  
  vec3 R = normalize( reflect(-L, N) );
  vec3 S = normalize(observerPosition - referencePoint);
  
  float ndotl = max(dot(N, L), 0.0);
  float rdots = max(dot(R, S), 0.0);
  
  return (Ka * Ila + Il * (Kd * ndotl + Ks * pow(rdots,n)))/255.0;
}

void main()
{
  vec3 vFinalColor = getLightColor(
    vec3(uFaceNormal),
    vec3(uLightPosition), 
    vec3(uReferencePoint),
    vec3(uObserver),
    uKa,
    uKd,
    uKs,
    uIla,
    uIl,
    uN
  );

  gl_FragColor = vec4(vFinalColor,1.0);
}
`;
