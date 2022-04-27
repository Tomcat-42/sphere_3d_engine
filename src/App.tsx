import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  Layout,
  Modal,
  Row,
  Select,
  Slider,
  Tooltip,
  Typography,
} from 'antd'
import { useState } from 'react'
import { useSceneContext } from './contexts/Scene'
import {
  Sphere,
  SphereConstructorType,
  SphereType,
} from './objects/Sphere'
import { P5Interface } from './scketches/P5Interface'
const { Sider, Content } = Layout
const { Option } = Select
const { Panel } = Collapse

function App() {
  const [
    createSphereModalVisible,
    setCreateSphereModalVisible,
  ] = useState(false)
  const {
    sceneObjects,
    setSelectedSphereId,
    selectedSphereId,
  } = useSceneContext()

  return (
    <Layout
      style={{
        overflow: 'hidden',
        height: '100vh',
      }}
      hasSider
    >
      <CreateSphereModal
        visible={createSphereModalVisible}
        setVisibility={setCreateSphereModalVisible}
      />
      <Content id='mainCanvas'>
        <P5Interface />
      </Content>
      <Sider
        style={{
          overflow: 'auto',
          position: 'sticky',
          padding: '1rem',
          right: 0,
          top: 0,
        }}
      >
        <Typography.Title
          level={2}
          style={{ color: 'white' }}
        >
          Sphere Generator
        </Typography.Title>
        <Collapse bordered={false}>
          <Panel key={1} showArrow={false} header='Spheres'>
            <p>Select a Sphere:</p>
            <Select
              allowClear
              style={{ width: '100%' }}
              onChange={(value) =>
                setSelectedSphereId(value)
              }
            >
              {sceneObjects.map((sphere: SphereType) => {
                return (
                  <Option key={sphere.id} value={sphere.id}>
                    {sphere.name}
                  </Option>
                )
              })}
            </Select>
          </Panel>
        </Collapse>
        <Typography.Title
          level={4}
          style={{ color: 'white', margin: '1rem 0' }}
        >
          Geometric Transformations
        </Typography.Title>
        <Collapse
          bordered={false}
          collapsible={
            selectedSphereId ? 'header' : 'disabled'
          }
        >
          <Panel
            key={1}
            showArrow={false}
            header='Rotation'
          >
            <label>X Rotation</label>
            <Slider />

            <label>Y Rotation</label>
            <Slider />

            <label>Z Rotation</label>
            <Slider />
          </Panel>
          <Panel key={2} showArrow={false} header='Scale'>
            <label>X Scale</label>
            <InputNumber
              style={{
                width: '100%',
                marginBottom: '0.5rem',
              }}
            />

            <label>Y Scale</label>
            <InputNumber
              style={{
                width: '100%',
                marginBottom: '0.5rem',
              }}
            />

            <label>Z Scale</label>
            <InputNumber
              style={{
                width: '100%',
                marginBottom: '0.5rem',
              }}
            />
          </Panel>
          <Panel
            key={3}
            showArrow={false}
            header='Translation'
          >
            <label>X Translation</label>
            <InputNumber
              style={{
                width: '100%',
                marginBottom: '0.5rem',
              }}
            />

            <label>Y Translation</label>
            <InputNumber
              style={{
                width: '100%',
                marginBottom: '0.5rem',
              }}
            />

            <label>Z Translation</label>
            <InputNumber
              style={{
                width: '100%',
                marginBottom: '0.5rem',
              }}
            />
          </Panel>
        </Collapse>
        <Row justify='end'>
          <Tooltip title='Create New Sphere'>
            <Button
              style={{
                margin: '1rem 0',
              }}
              type='primary'
              size='large'
              shape='round'
              icon={<PlusOutlined />}
              onClick={() =>
                setCreateSphereModalVisible(true)
              }
            />
          </Tooltip>
        </Row>
      </Sider>
    </Layout>
  )
}

const CreateSphereModal = ({
  visible,
  setVisibility,
}: any) => {
  const [form] = Form.useForm()
  const { setSceneObjects, sceneObjects } =
    useSceneContext()

  const handleCreateSphere = (values: {
    [key: string]: number | string
  }) => {
    console.log(values)
    const sphereData: any = {} as SphereConstructorType
    const sphereCenter: number[] = []

    Object.keys(values).forEach((key: string) => {
      if (key.startsWith('center'))
        sphereCenter.push(+values[key])
      else
        sphereData[key as keyof typeof sphereData] =
          values[key]
    })
    sphereData['center'] = sphereCenter

    const sphere = new Sphere(sphereData)

    setSceneObjects([...sceneObjects, sphere])
    setVisibility(false)
    form.resetFields()
  }

  return (
    <Modal
      title='Create New Sphere'
      visible={visible}
      onOk={form.submit}
      onCancel={() => {
        form.resetFields()
        setVisibility(false)
      }}
      okText='Create'
      cancelText='Cancel'
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleCreateSphere}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name='radius'
              label='Radius'
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                controls={false}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name='parallels'
              label='Parallels'
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                controls={false}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name='meridians'
              label='Meridians'
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                controls={false}
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} align='middle'>
          <Typography>Center: &nbsp;</Typography>(
          <Col span={7}>
            <Form.Item
              name='centerX'
              label='x'
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                controls={false}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name='centerY'
              label='y'
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                controls={false}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name='centerZ'
              label='z'
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                controls={false}
              />
            </Form.Item>
          </Col>
          )
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='name'
              label='Sphere Name'
              initialValue={`Sphere ${
                sceneObjects.length + 1
              }`}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='color'
              label='Color'
              rules={[{ required: true }]}
            >
              <input
                style={{ width: '100%' }}
                type='color'
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default App
