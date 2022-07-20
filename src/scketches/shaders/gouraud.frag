#shader fragment
#version 330 core

layout(location = 0) out vec4 color;

in vec3 vLightColor;

uniform vec3 uObjectColor;

void main() {
  color = vec4(vLightColor * uObjectColor, 1.0);
}