import { createContext, ReactNode, useContext, useState } from "react";
import { Camera, WindowType } from "../objects/Camera";
import { SphereType } from "../objects/Sphere";

enum drawModeEnum {
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
};

export const SceneContext = createContext({} as SceneContextType);

export const SceneContextProvider = ({ children }: { children: ReactNode }) => {
  const [sceneObjects, setSceneObjects] = useState<SphereType[]>([]);
  const [selectedSphereId, setSelectedSphereId] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState<drawModeEnum>(
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
      }}
    >
      {children}
    </SceneContext.Provider>
  );
};

export const useSceneContext = () => useContext(SceneContext);
