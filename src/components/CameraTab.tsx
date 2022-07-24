import { QuestionCircleFilled } from "@ant-design/icons";
import {
  Col,
  InputNumber,
  Row,
  Select,
  Slider,
  Tooltip,
  Typography,
} from "antd";
import { FC } from "react";
import { useShaderSceneContext } from "../contexts/ShaderScene";
const { Option } = Select;

export const CameraTab: FC = () => {
  return (
    <>
      <ProjectionType />
      <CameraVrp />
      <CameraP />
      <ViewUp />
      <ProjectionPlanDistance />
      <WindowSize />
      <ViewportSize />
      <NearAndFar />
    </>
  );
};

const ViewUp = () => {
  const { viewUp, setViewUp } = useShaderSceneContext();
  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        View Up:
      </Typography.Title>
      <Row gutter={6}>
        <Col span={8}>
          <label>X</label>
          <InputNumber
            controls={false}
            value={viewUp[0]}
            onChange={(value) => setViewUp([value, viewUp[1], viewUp[2]])}
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={8}>
          <label>Y</label>
          <InputNumber
            controls={false}
            value={viewUp[1]}
            onChange={(value) => setViewUp([viewUp[0], value, viewUp[2]])}
            style={{
              width: "100%",
            }}
          />
        </Col>
        <Col span={8}>
          <label>Z</label>
          <InputNumber
            controls={false}
            value={viewUp[2]}
            onChange={(value) => setViewUp([viewUp[0], viewUp[2], value])}
            style={{
              width: "100%",
            }}
          />
        </Col>
      </Row>
    </>
  );
};

const ViewportSize = () => {
  const { viewportSize, setViewportSize } = useShaderSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        Viewport:
      </Typography.Title>
      <Row gutter={6}>
        <Col span={12}>
          <label>X Min</label>
          <InputNumber
            value={viewportSize.width[0]}
            controls={false}
            defaultValue={viewportSize.width[0] || 0}
            onChange={(value) =>
              setViewportSize({
                ...viewportSize,
                width: [value, viewportSize.width[1]],
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
            value={viewportSize.width[1]}
            controls={false}
            defaultValue={viewportSize.width[1] || 0}
            onChange={(value) =>
              setViewportSize({
                ...viewportSize,
                width: [viewportSize.width[0], value],
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
            value={viewportSize.height[0]}
            controls={false}
            defaultValue={viewportSize.height[0] || 0}
            onChange={(value) =>
              setViewportSize({
                ...viewportSize,
                height: [value, viewportSize.height[1]],
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
            controls={false}
            value={viewportSize.height[1]}
            defaultValue={viewportSize.height[1] || 0}
            onChange={(value) =>
              setViewportSize({
                ...viewportSize,
                height: [viewportSize.height[0], value],
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

const ProjectionPlanDistance = () => {
  const { projectionPlanDistance, setProjectionPlanDistance } =
    useShaderSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        Projection Plan Distance (%):
        <Tooltip title="Distance beetween the camera VRP and P in percentage">
          <QuestionCircleFilled
            style={{ marginLeft: "8px", cursor: "pointer" }}
          />
        </Tooltip>
      </Typography.Title>

      <Slider
        min={0}
        value={projectionPlanDistance}
        max={100}
        step={1}
        onChange={(value) => setProjectionPlanDistance(value)}
      />
    </>
  );
};

const ProjectionType = () => {
  const { projectionType, drawMode, setDrawMode } = useShaderSceneContext();

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
  const { camNear, setCamNear, camFar, setCamFar } = useShaderSceneContext();

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
            controls={false}
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
            controls={false}
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
  const { windowSize, setWindowSize } = useShaderSceneContext();

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
            controls={false}
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
            controls={false}
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
            controls={false}
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
            controls={false}
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
  const { camP, setCamP } = useShaderSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        P:
      </Typography.Title>
      <Row gutter={6}>
        <Col span={8}>
          <label>X</label>
          <InputNumber
            controls={false}
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
            controls={false}
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
            controls={false}
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
  const { cameraVrpInterface, setCamVRP } = useShaderSceneContext();

  return (
    <>
      <Typography.Title style={{ marginTop: "1rem" }} level={4}>
        Position:
      </Typography.Title>
      <Row gutter={6}>
        <Col span={8}>
          <label>X</label>
          <InputNumber
            controls={false}
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
            controls={false}
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
            controls={false}
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
