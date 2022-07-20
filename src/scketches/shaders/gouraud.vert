#shader vertex
#version 330 core

layout(location = 0) in vec4 position;
layout(location = 1) in vec3 normals;

out vec3 vLightColor; // Result Gouraud color

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform vec3 uCameraPosition;

struct Material {
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
  float shininess;
};

struct Light {
  vec3 position;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;

  float constant;
  float linear;
  float quadratic;
};

uniform Material uMaterial;
uniform Light uLight;
uniform bool uUseLighting;

void main() {
  gl_Position = uProjection * uView * uModel * position;

  vec3 position = vec3(uModel * position);
  vec3 normal = mat3(transpose(inverse(uModel))) * normals;

  // Check if uLightPosition was set
  if (uUseLighting) {
    // ==== Ambient Light ====
    vec3 ambient = uLight.ambient * uMaterial.ambient;

    // ==== Diffuse Light ====
    vec3 norm = normalize(normal);
    vec3 lightDirection = normalize(uLight.position - position);
    
    float diff = max(dot(norm, lightDirection), 0.0);
    vec3 diffuse = uLight.diffuse * (diff * uMaterial.diffuse);

    // ==== Specular Light ====
    vec3 viewDirection = normalize(uCameraPosition - position);
    vec3 reflectDirection = reflect(-lightDirection, norm);

    float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), uMaterial.shininess);
    vec3 specular = uLight.specular * (spec * uMaterial.specular);

    // ==== Attenuation ====
    float distance = length(uLight.position - position);
    float attenuation = 1.0 / (uLight.constant + uLight.linear * distance + uLight.quadratic * (distance * distance));

    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    vec3 result = (ambient + diffuse + specular);
    vLightColor = result;
  } else {
    vLightColor = vec3(1.0);
  }
}

// =============================================================================================================== //

attribute vec3 position;
attribute vec3 normal;

uniform mat4 projection, modelview, normalMat;

varying vec3 normalInterp;
varying vec3 vertPos;

uniform int mode;   // Rendering mode
uniform float Ka;   // Ambient reflection coefficient
uniform float Kd;   // Diffuse reflection coefficient
uniform float Ks;   // Specular reflection coefficient
uniform float shininessVal; // Shininess

// Material color
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform vec3 lightPos; // Light position
varying vec4 color; //color

void main(){
  vec4 vertPos4 = modelview * vec4(position, 1.0);
  vertPos = vec3(vertPos4) / vertPos4.w;
  normalInterp = vec3(normalMat * vec4(normal, 0.0));
  gl_Position = projection * vertPos4;

  vec3 N = normalize(normalInterp);
  vec3 L = normalize(lightPos - vertPos);
  // Lambert's cosine law
  float lambertian = max(dot(N, L), 0.0);
  float specular = 0.0;
  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);      // Reflected light vector
    vec3 V = normalize(-vertPos); // Vector to viewer
    // Compute the specular term
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }
  color = vec4(Ka * ambientColor +
               Kd * lambertian * diffuseColor +
               Ks * specular * specularColor, 1.0);

  // only ambient
  if(mode == 2) color = vec4(Ka * ambientColor, 1.0);
  // only diffuse
  if(mode == 3) color = vec4(Kd * lambertian * diffuseColor, 1.0);
  // only specular
  if(mode == 4) color = vec4(Ks * specular * specularColor, 1.0);
}
