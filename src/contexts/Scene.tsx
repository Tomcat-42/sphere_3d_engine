import { createContext, ReactNode, useContext, useState } from "react";
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
};

export const SceneContext = createContext({} as SceneContextType);

export const SceneContextProvider = ({ children }: { children: ReactNode }) => {
  const [sceneObjects, setSceneObjects] = useState<SphereType[]>([]);
  const [selectedSphereId, setSelectedSphereId] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState<drawModeEnum>(
    drawModeEnum.perspective
  );

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
      }}
    >
      {children}
    </SceneContext.Provider>
  );
};

export const useSceneContext = () => useContext(SceneContext);
