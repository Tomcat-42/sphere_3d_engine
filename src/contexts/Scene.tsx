import { createContext, ReactNode, useContext, useState } from "react";
import { Camera, WindowType } from "../objects/Camera";
import { Light } from "../objects/Light";
import { SphereType } from "../objects/Sphere";

export enum drawModeEnum {
  perspective = "perspective",
  axonometric = "axonometric",
}

type SceneContextType = {
  sceneObjects: SphereType[];
  setSceneObjects: (scene: SphereType[]) => void;
  selectedSphereId: string | null;
  setSelectedSphereId: (sphere: string) => void;
  translateSelectedObject: (dx: number, dy: number, dz: number) => void;
  scaleSelectedObject: (sx: number, sy: number, sz: number) => void;
  rotateSelectedObject: (axis: "x" | "y" | "z", angle: number) => void;
  clearInterface: () => void;
  drawMode: drawModeEnum;
  setDrawMode: (drawMode: drawModeEnum) => void;
  drawModeEnum: typeof drawModeEnum;
  myCamera: Camera;
  setMyCamera: (camera: Camera) => void;
  cameraVrpInterface: number[];
  setCameraVrpInterface: (vrp: number[]) => void;
  setCamVRP: (vrp: number[]) => void;
  camP: number[];
  setCamP: (p: number[]) => void;
  windowSize: WindowType;
  setWindowSize: (windowSize: WindowType) => void;
  camNear: number;
  setCamNear: (near: number) => void;
  camFar: number;
  setCamFar: (far: number) => void;
  projectionType: {
    [drawModeEnum.perspective]: { value: drawModeEnum; label: string };
    [drawModeEnum.axonometric]: { value: drawModeEnum; label: string };
  };
  light: Light;
  setLight: (light: Light) => void;
  lightPosition: number[];
  setLightPosition: (position: number[]) => void;
  ambientLightIntensity: number[];
  setAmbientLightIntensity: (intensity: number[]) => void;
  lightIntensity: number[];
  setLightIntensity: (intensity: number[]) => void;
  axisToRotate: "x" | "y" | "z";
  setAxisToRotate: (axis: "x" | "y" | "z") => void;
  isToRotateLight: boolean;
  setIsToRotateLight: (isToRotateLight: boolean) => void;
  projectionPlanDistance: number;
  setProjectionPlanDistance: (projectionPlanDistance: number) => void;
  viewportSize: WindowType;
  setViewportSize: (viewPortSize: WindowType) => void;
  setLocalViewportSize: (viewPortSize: WindowType) => void;
  viewUp: number[];
  setViewUp: (viewUp: number[]) => void;
};

export const SceneContext = createContext({} as SceneContextType);

export const SceneContextProvider = ({ children }: { children: ReactNode }) => {
  const [sceneObjects, setSceneObjects] = useState<SphereType[]>([]);
  const [selectedSphereId, setSelectedSphereId] = useState<string | null>(null);
  const [drawMode, setLocalDrawMode] = useState<drawModeEnum>(
    drawModeEnum.perspective
  );

  const [myCamera, setMyCamera] = useState<Camera>({} as Camera);
  const [cameraVrpInterface, setCameraVrpInterface] = useState<number[]>([
    0, 0, 100,
  ]);
  const [camP, setLocalCamP] = useState<number[]>([0, 0, 0]);
  const [windowSize, setLocalWindowSize] = useState<WindowType>({
    width: [-300, 300],
    height: [-150, 150],
  });
  const [camNear, setLocalCamNear] = useState<number>(20);
  const [camFar, setLocalCamFar] = useState<number>(1000);
  const projectionType = {
    [drawModeEnum.perspective]: {
      value: drawModeEnum.perspective,
      label: "Perspective",
    },
    [drawModeEnum.axonometric]: {
      value: drawModeEnum.axonometric,
      label: "Axonometric",
    },
  };
  const [projectionPlanDistance, setLocalProjectionPlanDistance] =
    useState<number>(100);
  const [viewportSize, setLocalViewportSize] = useState<WindowType>({
    width: [0, 0],
    height: [0, 0],
  });
  const [viewUp, setLocalViewUp] = useState<number[]>([0, 1, 0]);

  const [light, setLight] = useState<Light>({} as Light);
  const [lightPosition, setLocalLightPosition] = useState<number[]>([
    -80, 0, 0, 1,
  ]);
  const [ambientLightIntensity, setLocalAmbientLightIntensity] = useState<
    number[]
  >([255, 255, 255]);
  const [lightIntensity, setLocalLightIntensity] = useState<number[]>([
    255, 255, 255,
  ]);
  const [axisToRotate, setAxisToRotate] = useState<"x" | "y" | "z">("y");
  const [isToRotateLight, setIsToRotateLight] = useState<boolean>(false);

  const setDrawMode = (newDrawMode: drawModeEnum) => {
    myCamera.setProjectionMatrix(newDrawMode);
    setLocalDrawMode(newDrawMode);
  };

  const setLightPosition = (newPosition: number[]) => {
    setLocalLightPosition(newPosition);
    light.setPosition(newPosition);
  };

  const setAmbientLightIntensity = (newIntensity: number[]) => {
    setLocalAmbientLightIntensity(newIntensity);
    light.setAmbientLightIntensity(newIntensity);
  };

  const setLightIntensity = (newIntensity: number[]) => {
    setLocalLightIntensity(newIntensity);
    light.setLightIntensity(newIntensity);
  };

  const setViewUp = (newViewUp: number[]) => {
    setLocalViewUp(newViewUp);
    myCamera.setViewUp(newViewUp);
  };

  const setViewportSize = (newSize: WindowType) => {
    setLocalViewportSize(newSize);
    myCamera.setViewport(newSize);
  };

  const setProjectionPlanDistance = (newDistance: number) => {
    setLocalProjectionPlanDistance(newDistance);
    myCamera.setProjectionPlanDistance(newDistance);
  };

  const setCamP = (position: number[]) => {
    myCamera?.setP(position);
    setLocalCamP(position);
  };

  const setCamVRP = (position: number[]) => {
    myCamera?.setVrp(position);
    setCameraVrpInterface(position);
  };

  const setWindowSize = (window: WindowType) => {
    myCamera?.setWindow(window);
    setLocalWindowSize(window);
  };

  const setCamFar = (newFar: number) => {
    myCamera?.setFar(newFar);
    setLocalCamFar(newFar);
  };
  const setCamNear = (newNear: number) => {
    myCamera?.setNear(newNear);
    setLocalCamNear(newNear);
  };

  const translateSelectedObject = (dx: number, dy: number, dz: number) => {
    const selectedSphere = sceneObjects?.find(
      (sphere: SphereType) => sphere.id === selectedSphereId
    );

    selectedSphere?.translate(dx, dy, dz);
  };

  const scaleSelectedObject = (sx: number, sy: number, sz: number) => {
    const selectedSphere = sceneObjects?.find(
      (sphere: SphereType) => sphere.id === selectedSphereId
    );

    selectedSphere?.scale(sx, sy, sz);
  };

  const rotateSelectedObject = (axis: "x" | "y" | "z", angle: number) => {
    const selectedSphere = sceneObjects?.find(
      (sphere: SphereType) => sphere.id === selectedSphereId
    );

    selectedSphere?.rotate(angle, axis);
  };

  const clearInterface = () => {
    setSceneObjects([]);
    setSelectedSphereId(null);
  };

  return (
    <SceneContext.Provider
      value={{
        sceneObjects,
        setSceneObjects,
        selectedSphereId,
        setSelectedSphereId,
        translateSelectedObject,
        scaleSelectedObject,
        rotateSelectedObject,
        clearInterface,
        drawMode,
        setDrawMode,
        drawModeEnum,
        myCamera,
        setMyCamera,
        cameraVrpInterface,
        setCameraVrpInterface,
        setCamVRP,
        camP,
        setCamP,
        windowSize,
        setWindowSize,
        camNear,
        setCamNear,
        camFar,
        setCamFar,
        projectionType,
        light,
        setLight,
        lightPosition,
        setLightPosition,
        ambientLightIntensity,
        setAmbientLightIntensity,
        lightIntensity,
        setLightIntensity,
        axisToRotate,
        setAxisToRotate,
        isToRotateLight,
        setIsToRotateLight,
        projectionPlanDistance,
        setProjectionPlanDistance,
        viewportSize,
        setViewportSize,
        viewUp,
        setViewUp,
        setLocalViewportSize,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
};

export const useSceneContext = () => useContext(SceneContext);
