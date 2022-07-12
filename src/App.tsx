import { ClearOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Collapse, Layout, Row, Tabs, Tooltip, Typography } from "antd";
import { useState } from "react";
import { CameraTab } from "./components/CameraTab";
import { CreateSphereModal } from "./components/SphereModal";
import { SphereTab } from "./components/SphereTab";
import { useSceneContext } from "./contexts/Scene";
import { SphereType } from "./objects/Sphere";
import { P5Interface } from "./scketches/P5Interface";
const { Sider, Content } = Layout;
const { Panel } = Collapse;
const { TabPane } = Tabs;

function App() {
  const { setSelectedSphereId, clearInterface } = useSceneContext();

  const [createSphereModalVisible, setCreateSphereModalVisible] =
    useState(false);
  const [defaultSphere, setDefaultSphere] = useState<SphereType | undefined>();

  const clear = () => {
    setSelectedSphereId("");
    clearInterface();
  };

  return (
    <Layout
      style={{
        height: "100vh",
        boxSizing: "border-box",
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
        <Typography.Title level={2} style={{ textAlign: "center" }}>
          Sphere Generator
        </Typography.Title>
        <Tabs>
          <TabPane tab="Spheres" key="1">
            <SphereTab
              setDefaultSphere={setDefaultSphere}
              setCreateSphereModalVisible={setCreateSphereModalVisible}
            />
          </TabPane>

          <TabPane style={{ color: "white" }} tab="Camera" key="2">
            <CameraTab />
          </TabPane>

          <TabPane tab="Light" key="3">
            <Collapse bordered={false}>
              <Panel key={1} showArrow={false} header="Light">
                <label>Light Params Here</label>
              </Panel>
            </Collapse>
          </TabPane>
        </Tabs>

        <Row
          style={{ position: "sticky", top: "100%" }}
          gutter={16}
          justify="space-around"
        >
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

export default App;
