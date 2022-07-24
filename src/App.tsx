import { ClearOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Layout, Row, Tabs, Tooltip, Typography } from "antd";
import { useState } from "react";
import { CameraTab } from "./components/CameraTab";
import { LightTab } from "./components/LightTab";
import { CreateSphereModal } from "./components/SphereModal";
import { SphereTab } from "./components/SphereTab";
import { useShaderSceneContext } from "./contexts/ShaderScene";
import { SphereType } from "./objects/Sphere";
import { ShaderedScketch } from "./scketches/ShaderedScketch";
const { Sider, Content } = Layout;
const { TabPane } = Tabs;

export const App = () => {
  const { setSelectedSphereId, clearInterface } = useShaderSceneContext();

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
        <ShaderedScketch />
      </Content>
      <Sider
        width="240px"
        style={{
          overflow: "auto",
          padding: "1rem",
        }}
      >
        <Typography.Title level={2} style={{ textAlign: "center" }}>
          Sphere Generator
        </Typography.Title>
        <Tabs defaultActiveKey="3" style={{ color: "white" }}>
          <TabPane tab="Spheres" key="1">
            <SphereTab
              setDefaultSphere={setDefaultSphere}
              setCreateSphereModalVisible={setCreateSphereModalVisible}
            />
          </TabPane>

          <TabPane style={{ color: "white" }} tab="Camera" key="2">
            <CameraTab />
          </TabPane>

          <TabPane style={{ color: "white" }} tab="Light" key="3">
            <LightTab />
          </TabPane>
        </Tabs>

        <Row
          style={{ position: "sticky", top: "100%", marginTop: "1.5rem" }}
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
};
