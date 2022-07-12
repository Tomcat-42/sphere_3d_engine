import { DeleteFilled, EditFilled } from "@ant-design/icons";
import {
  Button,
  Collapse,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Slider,
  Typography,
} from "antd";
import { FC, useState } from "react";
import { useSceneContext } from "../contexts/Scene";
import { SphereType } from "../objects/Sphere";
const { Panel } = Collapse;
const { Option } = Select;

type SphereTabProps = {
  setDefaultSphere: (sphere: SphereType | undefined) => void;
  setCreateSphereModalVisible: (value: boolean) => void;
};

export const SphereTab: FC<SphereTabProps> = ({
  setDefaultSphere,
  setCreateSphereModalVisible,
}) => {
  const {
    sceneObjects,
    setSelectedSphereId,
    selectedSphereId,
    translateSelectedObject,
    scaleSelectedObject,
    rotateSelectedObject,
  } = useSceneContext();

  const [translateX, setTranslateX] = useState<number>(1);
  const [translateY, setTranslateY] = useState<number>(1);
  const [translateZ, setTranslateZ] = useState<number>(1);

  const [scaleX, setScaleX] = useState<number>(1);
  const [scaleY, setScaleY] = useState<number>(1);
  const [scaleZ, setScaleZ] = useState<number>(1);

  const [rotateX, setRotateX] = useState<number>(1);
  const [rotateY, setRotateY] = useState<number>(1);
  const [rotateZ, setRotateZ] = useState<number>(1);

  const deleteSphere = () => {
    sceneObjects.forEach((sphere: SphereType) => {
      if (sphere.id === selectedSphereId) {
        sceneObjects.splice(sceneObjects.indexOf(sphere), 1);
      }
    });
    setSelectedSphereId("");
  };

  const getSphereById = (id: string) => {
    return sceneObjects.find((sphere: SphereType) => {
      return sphere.id === id;
    });
  };

  return (
    <>
      <Collapse bordered={false}>
        <Panel key={1} showArrow={false} header="Spheres">
          <p>Select a Sphere:</p>
          <Select
            allowClear
            value={selectedSphereId}
            style={{ width: "100%" }}
            onChange={(value) => setSelectedSphereId(value)}
          >
            {sceneObjects.map((sphere: SphereType) => {
              return (
                <Option key={sphere.id} value={sphere.id}>
                  {sphere.name}
                </Option>
              );
            })}
          </Select>
          {selectedSphereId && (
            <Row justify="space-around" style={{ marginTop: "1rem" }}>
              <Popconfirm
                title="Are you sure?"
                okText="yes"
                cancelText="no"
                onConfirm={deleteSphere}
              >
                <Button
                  icon={<DeleteFilled />}
                  shape="circle"
                  type="primary"
                  danger
                />
              </Popconfirm>
              <Button
                icon={<EditFilled />}
                shape="circle"
                type="primary"
                onClick={() => {
                  setDefaultSphere(getSphereById(selectedSphereId));
                  setCreateSphereModalVisible(true);
                }}
              />
            </Row>
          )}
        </Panel>
      </Collapse>
      <Typography.Title level={4} style={{ color: "white", margin: "1rem 0" }}>
        Geometric Transformations
      </Typography.Title>
      <Collapse
        destroyInactivePanel={true}
        bordered={false}
        collapsible={selectedSphereId ? "header" : "disabled"}
      >
        <Panel key={1} showArrow={false} header="Rotation">
          {selectedSphereId && (
            <>
              <label>X Rotation</label>
              <Slider
                min={0}
                max={360}
                step={0.5}
                onChange={(value) => {
                  setRotateX(value);
                  rotateSelectedObject("x", value - rotateX);
                }}
              />

              <label>Y Rotation</label>
              <Slider
                min={0}
                max={360}
                step={0.5}
                onChange={(value) => {
                  setRotateY(value);
                  rotateSelectedObject("y", value - rotateY);
                }}
              />

              <label>Z Rotation</label>
              <Slider
                min={0}
                max={360}
                step={0.5}
                onChange={(value) => {
                  setRotateZ(value);
                  rotateSelectedObject("z", value - rotateZ);
                }}
              />
            </>
          )}
        </Panel>
        <Panel key={2} showArrow={false} header="Scale">
          {selectedSphereId && (
            <>
              <label>X Scale</label>
              <InputNumber
                defaultValue={0}
                onChange={(value) => setScaleX(value || 1)}
                style={{
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
              />

              <label>Y Scale</label>
              <InputNumber
                defaultValue={1}
                onChange={(value) => setScaleY(value || 1)}
                style={{
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
              />

              <label>Z Scale</label>
              <InputNumber
                defaultValue={1}
                onChange={(value) => setScaleZ(value || 1)}
                style={{
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
              />
              <div style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  onClick={() => scaleSelectedObject(scaleX, scaleY, scaleZ)}
                >
                  Scale
                </Button>
              </div>
            </>
          )}
        </Panel>
        <Panel key={3} showArrow={false} header="Translation">
          {selectedSphereId && (
            <>
              <label>X Translation</label>
              <InputNumber
                onChange={(value: number) => setTranslateX(value || 0)}
                defaultValue={0}
                style={{
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
              />

              <label>Y Translation</label>
              <InputNumber
                onChange={(value: number) => setTranslateY(value || 0)}
                defaultValue={0}
                style={{
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
              />

              <label>Z Translation</label>
              <InputNumber
                onChange={(value: number) => setTranslateZ(value || 0)}
                defaultValue={0}
                style={{
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
              />
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Button
                  type="primary"
                  onClick={() => {
                    translateSelectedObject(translateX, translateY, translateZ);
                  }}
                >
                  Translate
                </Button>
              </div>
            </>
          )}
        </Panel>
      </Collapse>
    </>
  );
};
