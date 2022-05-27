import { ShaderTest } from "./scketches/test/ShaderTest";

export const Shader = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div id="shaderCanvas" style={{width: '100%', height: '100%'}}>
        <ShaderTest />
      </div>
    </div>
  );
};
