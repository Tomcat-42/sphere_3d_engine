import { Checkbox, Col, InputNumber, Row, Select, Typography } from "antd";
import { useShaderSceneContext } from "../contexts/ShaderScene";
const { Option } = Select;

export const LightTab = () => {
  return (
    <>
      <ShadingType />
      <RotateLight />
      <AmbientLight />
      <LightPosition />
      <CommomLight />
    </>
  );
};

const RotateLight = () => {
  const { isToRotateLight, setIsToRotateLight, axisToRotate, setAxisToRotate } =
    useShaderSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        Rotate Light:
      </Typography.Title>
      <Checkbox
        checked={isToRotateLight}
        style={{ color: "white", marginBottom: "10px" }}
        onChange={({ target: { checked } }) => setIsToRotateLight(checked)}
      >
        Rotate Light
      </Checkbox>
      <Select
        disabled={!isToRotateLight}
        value={axisToRotate}
        onChange={(axis: "x" | "y" | "z") => setAxisToRotate(axis)}
        style={{ width: "100%" }}
      >
        <Option value={"y"}>Y</Option>
        <Option value={"x"}>X</Option>
        <Option value={"z"}>Z</Option>
      </Select>
    </>
  );
};

const CommomLight = () => {
  const { lightIntensity, setLightIntensity } = useShaderSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        Light Intensity:
      </Typography.Title>
      <Row gutter={6}>
        <Col span={8}>
          <label>R</label>
          <InputNumber
            controls={false}
            value={lightIntensity[0]}
            onChange={(value) =>
              setLightIntensity([value, lightIntensity[1], lightIntensity[2]])
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={8}>
          <label>G</label>
          <InputNumber
            controls={false}
            value={lightIntensity[1]}
            onChange={(value) =>
              setLightIntensity([lightIntensity[0], value, lightIntensity[2]])
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={8}>
          <label>B</label>
          <InputNumber
            controls={false}
            value={lightIntensity[2]}
            onChange={(value) =>
              setLightIntensity([lightIntensity[0], lightIntensity[2], value])
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
      </Row>
    </>
  );
};

const AmbientLight = () => {
  const { ambientLightIntensity, setAmbientLightIntensity } =
    useShaderSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        Ambient Light Intensity:
      </Typography.Title>
      <Row gutter={6}>
        <Col span={8}>
          <label>R</label>
          <InputNumber
            controls={false}
            value={ambientLightIntensity[0]}
            onChange={(value) =>
              setAmbientLightIntensity([
                value,
                ambientLightIntensity[1],
                ambientLightIntensity[2],
              ])
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={8}>
          <label>G</label>
          <InputNumber
            controls={false}
            value={ambientLightIntensity[1]}
            onChange={(value) =>
              setAmbientLightIntensity([
                ambientLightIntensity[0],
                value,
                ambientLightIntensity[2],
              ])
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={8}>
          <label>B</label>
          <InputNumber
            controls={false}
            value={ambientLightIntensity[2]}
            onChange={(value) =>
              setAmbientLightIntensity([
                ambientLightIntensity[0],
                ambientLightIntensity[2],
                value,
              ])
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
      </Row>
    </>
  );
};

const LightPosition = () => {
  const { lightPosition, setLightPosition } = useShaderSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        Light Position:
      </Typography.Title>
      <Row gutter={6}>
        <Col span={8}>
          <label>X</label>
          <InputNumber
            controls={false}
            value={lightPosition[0]}
            onChange={(value) =>
              setLightPosition([
                value || 0,
                lightPosition[1],
                lightPosition[2],
                1,
              ])
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={8}>
          <label>Y</label>
          <InputNumber
            controls={false}
            value={lightPosition[1]}
            onChange={(value) =>
              setLightPosition([
                lightPosition[0],
                value || 0,
                lightPosition[2],
                1,
              ])
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={8}>
          <label>Z</label>
          <InputNumber
            controls={false}
            value={lightPosition[2]}
            onChange={(value) =>
              setLightPosition([
                lightPosition[0],
                lightPosition[2],
                value || 0,
                1,
              ])
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
      </Row>
    </>
  );
};

const ShadingType = () => {
  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        Shading:
      </Typography.Title>
      <Select
        onChange={(newShading) => console.debug(newShading)}
        defaultValue={"flat"}
        style={{ width: "100%" }}
      >
        <Option value={"flat"}>Flat Shading</Option>
      </Select>
    </>
  );
};
