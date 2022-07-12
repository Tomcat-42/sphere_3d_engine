import { Col, InputNumber, Row, Select, Typography } from "antd";
import { FC } from "react";
import { useSceneContext } from "../contexts/Scene";
const { Option } = Select;

export const CameraTab: FC = () => {
  return (
    <>
      <ProjectionType />
      <CameraVrp />
      <CameraP />
      <WindowSize />
      <NearAndFar />
    </>
  );
};

const ProjectionType = () => {
  const { projectionType, drawMode, setDrawMode } = useSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        Projection:
      </Typography.Title>
      <Select
        onChange={(newDrawMode) => setDrawMode(newDrawMode)}
        defaultValue={drawMode}
        style={{ width: "100%" }}
      >
        <Option value={projectionType.perspective.value}>
          {projectionType.perspective.label}
        </Option>
        <Option value={projectionType.axonometric.value}>
          {projectionType.axonometric.label}
        </Option>
      </Select>
    </>
  );
};

const NearAndFar = () => {
  const { camNear, setCamNear, camFar, setCamFar } = useSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        Near &#38; Far:
      </Typography.Title>
      <Row gutter={6}>
        <Col span={12}>
          <label>Near</label>
          <InputNumber
            value={camNear}
            defaultValue={camNear}
            onChange={(value) => setCamNear(value)}
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={12}>
          <label>Far</label>
          <InputNumber
            value={camFar}
            defaultValue={camFar}
            onChange={(value) => setCamFar(value)}
            style={{
              width: "100%",
            }}
          />
        </Col>
      </Row>
    </>
  );
};

const WindowSize = () => {
  const { windowSize, setWindowSize } = useSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        Window:
      </Typography.Title>
      <Row gutter={6}>
        <Col span={12}>
          <label>X Min</label>
          <InputNumber
            value={windowSize.width[0]}
            defaultValue={windowSize.width[0] || 0}
            onChange={(value) =>
              setWindowSize({
                ...windowSize,
                width: [value, windowSize.width[1]],
              })
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={12}>
          <label>X Max</label>
          <InputNumber
            value={windowSize.width[1]}
            defaultValue={windowSize.width[1] || 0}
            onChange={(value) =>
              setWindowSize({
                ...windowSize,
                width: [windowSize.width[0], value],
              })
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
      </Row>
      <Row gutter={6}>
        <Col span={12}>
          <label>Y Min</label>
          <InputNumber
            value={windowSize.height[0]}
            defaultValue={windowSize.height[0] || 0}
            onChange={(value) =>
              setWindowSize({
                ...windowSize,
                height: [value, windowSize.height[1]],
              })
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={12}>
          <label>Y Max</label>
          <InputNumber
            value={windowSize.height[1]}
            defaultValue={windowSize.height[1] || 0}
            onChange={(value) =>
              setWindowSize({
                ...windowSize,
                height: [windowSize.height[0], value],
              })
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

const CameraP = () => {
  const { camP, setCamP } = useSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        P:
      </Typography.Title>
      <Row gutter={6}>
        <Col span={8}>
          <label>X</label>
          <InputNumber
            value={camP[0]}
            defaultValue={camP[0] || 0}
            onChange={(value) => setCamP([value, camP[1], camP[2]])}
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={8}>
          <label>Y</label>
          <InputNumber
            value={camP[1]}
            defaultValue={camP[1] || 0}
            onChange={(value) => setCamP([camP[0], value, camP[2]])}
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={8}>
          <label>Z</label>
          <InputNumber
            value={camP[2]}
            defaultValue={camP[2] || 0}
            onChange={(value) => setCamP([camP[0], camP[2], value])}
            style={{
              width: "100%",
            }}
          />
        </Col>
      </Row>
    </>
  );
};

const CameraVrp = () => {
  const { cameraVrpInterface, setCamVRP } = useSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        Position:
      </Typography.Title>
      <Row gutter={6}>
        <Col span={8}>
          <label>X</label>
          <InputNumber
            value={cameraVrpInterface[0]}
            defaultValue={cameraVrpInterface[0] || 0}
            onChange={(value) =>
              setCamVRP([value, cameraVrpInterface[1], cameraVrpInterface[2]])
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={8}>
          <label>Y</label>
          <InputNumber
            value={cameraVrpInterface[1]}
            defaultValue={cameraVrpInterface[1] || 0}
            onChange={(value) =>
              setCamVRP([cameraVrpInterface[0], value, cameraVrpInterface[2]])
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={8}>
          <label>Z</label>
          <InputNumber
            value={cameraVrpInterface[2]}
            defaultValue={cameraVrpInterface[2] || 0}
            onChange={(value) =>
              setCamVRP([cameraVrpInterface[0], cameraVrpInterface[2], value])
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
