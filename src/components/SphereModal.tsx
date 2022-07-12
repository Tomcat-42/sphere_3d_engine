import { Col, Form, Input, InputNumber, Modal, Row, Typography } from "antd";
import { useSceneContext } from "../contexts/Scene";
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
