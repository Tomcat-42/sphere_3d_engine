import { Col, Form, Input, InputNumber, Modal, Row } from "antd";
import { useShaderSceneContext } from "../contexts/ShaderScene";
import { Sphere, SphereConstructorType, SphereType } from "../objects/Sphere";

export const CreateSphereModal = ({
  defaultSphere,
  visible,
  setVisibility,
}: {
  defaultSphere?: SphereType;
  visible: boolean;
  setVisibility: (value: boolean) => void;
}) => {
  const [form] = Form.useForm();
  const { setSceneObjects, sceneObjects } = useShaderSceneContext();
  const isToEditSphere = defaultSphere ? true : false;

  const formatFormData = (data: any) => {
    const sphereData: any = {} as SphereConstructorType;
    sphereData["Ka"] = [];
    sphereData["Kd"] = [];
    sphereData["Ks"] = [];
    const sphereCenter: number[] = [];

    Object.keys(data).forEach((key: string) => {
      if (key.startsWith("center")) sphereCenter.push(data[key]);
      if (key.startsWith("K"))
        sphereData[key.split("").splice(0, 2).join("")].push(data[key]);
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
    setVisibility(false);
    form.resetFields();
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
        <Row gutter={16} align="middle">
          Center: &nbsp; (
          <Col span={6}>
            <Form.Item
              name="centerX"
              label="x"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.center[0] : 0}
            >
              <InputNumber
                disabled={isToEditSphere}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name="centerY"
              label="y"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.center[1] : 0}
            >
              <InputNumber
                disabled={isToEditSphere}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name="centerZ"
              label="z"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.center[2] : -100}
            >
              <InputNumber
                disabled={isToEditSphere}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Col>
          )
        </Row>
        <Row gutter={16} align="middle">
          Ka: &nbsp; (
          <Col span={7}>
            <Form.Item
              name="KaR"
              label="R"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.Ka[0] : 0.0}
            >
              <InputNumber
                min={0}
                max={1}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name="KaG"
              label="G"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.Ka[1] : 0.0}
            >
              <InputNumber
                min={0}
                max={1}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name="KaB"
              label="B"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.Ka[2] : 0.3}
            >
              <InputNumber
                min={0}
                max={1}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Col>
          )
        </Row>
        <Row gutter={16} align="middle">
          Kd: &nbsp; (
          <Col span={7}>
            <Form.Item
              name="KdR"
              label="R"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.Kd[0] : 0.0}
            >
              <InputNumber
                min={0}
                max={1}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name="KdG"
              label="G"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.Kd[1] : 0.3}
            >
              <InputNumber
                min={0}
                max={1}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name="KdB"
              label="B"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.Kd[2] : 0.0}
            >
              <InputNumber
                min={0}
                max={1}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Col>
          )
        </Row>
        <Row gutter={16} align="middle">
          Ks: &nbsp; (
          <Col span={7}>
            <Form.Item
              name="KsR"
              label="R"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.Ks[0] : 0.3}
            >
              <InputNumber
                min={0}
                max={1}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name="KsG"
              label="G"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.Ks[1] : 0}
            >
              <InputNumber
                min={0}
                max={1}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name="KsB"
              label="B"
              rules={[{ required: true }]}
              initialValue={isToEditSphere ? defaultSphere?.Ks[2] : 0}
            >
              <InputNumber
                min={0}
                max={1}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Col>
          )
        </Row>
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
              name="n"
              label="Shininess"
              initialValue={defaultSphere ? defaultSphere?.n : 32}
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} controls={false} min={1} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
