import {
  PlusOutlined,
  ClearOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  Layout,
  Modal,
  Popconfirm,
  Row,
  Select,
  Slider,
  Tooltip,
  Typography,
} from "antd";
import { useState } from "react";
import { useSceneContext } from "./contexts/Scene";
import { Sphere, SphereConstructorType, SphereType } from "./objects/Sphere";
import { P5Interface } from "./scketches/P5Interface";
const { Sider, Content } = Layout;
const { Option } = Select;
const { Panel } = Collapse;

function App() {
  const [createSphereModalVisible, setCreateSphereModalVisible] =
    useState(false);
  const {
    sceneObjects,
    setSelectedSphereId,
    selectedSphereId,
    translateSelectedObject,
    scaleSelectedObject,
    rotateSelectedObject,
    clearInterface,
  } = useSceneContext();

  const [defaultSphere, setDefaultSphere] = useState<SphereType | undefined>();

  const [translateX, setTranslateX] = useState<number>(0);
  const [translateY, setTranslateY] = useState<number>(0);
  const [translateZ, setTranslateZ] = useState<number>(0);

  const [scaleX, setScaleX] = useState<number>(1);
  const [scaleY, setScaleY] = useState<number>(1);
  const [scaleZ, setScaleZ] = useState<number>(1);

  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [rotateZ, setRotateZ] = useState<number>(0);

  const clear = () => {
    setSelectedSphereId("");
    clearInterface();
  };

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
    <Layout
      style={{
        height: "100vh",
      }}
      hasSider
    >
      <CreateSphereModal
        defaultSphere={defaultSphere}
        visible={createSphereModalVisible}
        setVisibility={setCreateSphereModalVisible}
      />
      <Content
        id="mainCanvas"
        style={{
          boxSizing: "border-box",
          margin: "auto",
          display: "flex",
          justifyContent: "center",
          height: "100%",
          alignItems: "center",
        }}
      >
        <P5Interface />
      </Content>
      <Sider
        style={{
          overflow: "auto",
          position: "sticky",
          padding: "1rem",
          right: 0,
          top: 0,
        }}
      >
        <Typography.Title level={2} style={{ color: "white" }}>
          Sphere Generator
        </Typography.Title>
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
        <Typography.Title
          level={4}
          style={{ color: "white", margin: "1rem 0" }}
        >
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
                      translateSelectedObject(
                        translateX,
                        translateY,
                        translateZ
                      );
                    }}
                  >
                    Translate
                  </Button>
                </div>
              </>
            )}
          </Panel>
        </Collapse>
        <Row gutter={16} justify="space-around">
          <Tooltip title="Clear Interface">
            <Button
              style={{
                margin: "1rem 0",
              }}
              type="primary"
              size="large"
              shape="round"
              icon={<ClearOutlined />}
              onClick={clear}
            />
          </Tooltip>
          <Tooltip title="Create New Sphere">
            <Button
              style={{
                margin: "1rem 0",
              }}
              type="primary"
              size="large"
              shape="round"
              icon={<PlusOutlined />}
              onClick={() => {
                setDefaultSphere(undefined);
                setCreateSphereModalVisible(true);
              }}
            />
          </Tooltip>
        </Row>
      </Sider>
    </Layout>
  );
}

const CreateSphereModal = ({
  defaultSphere,
  visible,
  setVisibility,
}: {
  defaultSphere?: SphereType;
  visible: boolean;
  setVisibility: (value: boolean) => void;
}) => {
  const [form] = Form.useForm();
  const { setSceneObjects, sceneObjects } = useSceneContext();
  const isToEditSphere = defaultSphere ? true : false;

  const formatFormData = (data: any) => {
    const sphereData: any = {} as SphereConstructorType;
    const sphereCenter: number[] = [];

    Object.keys(data).forEach((key: string) => {
      if (key.startsWith("center")) sphereCenter.push(data[key]);
      else sphereData[key as keyof typeof sphereData] = data[key];
    });
    sphereData["center"] = sphereCenter;

    return sphereData;
  };

  const handleCreateSphere = (values: { [key: string]: number | string }) => {
    const sphereData = formatFormData(values);
    const sphere = new Sphere(sphereData);

    setSceneObjects([...sceneObjects, sphere]);
    setVisibility(false);
    form.resetFields();
  };

  const handleEditSphere = (values: any) => {
    const sphereData = formatFormData(values);
    defaultSphere?.updateData(sphereData);
  };

  return (
    <Modal
      destroyOnClose={true}
      title={`${isToEditSphere ? "Update" : "Create New"} Sphere`}
      visible={visible}
      onOk={form.submit}
      onCancel={() => {
        form.resetFields();
        setVisibility(false);
      }}
      okText={isToEditSphere ? "Update" : "Create"}
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={isToEditSphere ? handleEditSphere : handleCreateSphere}
        preserve={false}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="radius"
              label="Radius"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.radius : 50}
            >
              <InputNumber style={{ width: "100%" }} controls={false} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="parallels"
              label="Parallels"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.parallelsAmount : 8}
            >
              <InputNumber style={{ width: "100%" }} controls={false} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="meridians"
              label="Meridians"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.meridiansAmout : 9}
            >
              <InputNumber style={{ width: "100%" }} controls={false} min={0} />
            </Form.Item>
          </Col>
        </Row>
        {!isToEditSphere && (
          <Row gutter={16} align="middle">
            <Typography>Center: &nbsp;</Typography>(
            <Col span={7}>
              <Form.Item
                name="centerX"
                label="x"
                rules={[{ required: true }]}
                initialValue={isToEditSphere ? defaultSphere?.center[0] : 0}
              >
                <InputNumber style={{ width: "100%" }} controls={false} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="centerY"
                label="y"
                rules={[{ required: true }]}
                initialValue={isToEditSphere ? defaultSphere?.center[1] : -50}
              >
                <InputNumber style={{ width: "100%" }} controls={false} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="centerZ"
                label="z"
                rules={[{ required: true }]}
                initialValue={isToEditSphere ? defaultSphere?.center[2] : 0}
              >
                <InputNumber style={{ width: "100%" }} controls={false} />
              </Form.Item>
            </Col>
            )
          </Row>
        )}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Sphere Name"
              initialValue={
                defaultSphere
                  ? defaultSphere?.name
                  : `Sphere ${sceneObjects.length + 1}`
              }
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="color"
              label="Color"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.color : "#00ff00"}
            >
              <input style={{ width: "100%" }} type="color" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default App;
