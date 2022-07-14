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
