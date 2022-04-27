import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react'
import { SphereType } from '../objects/Sphere'

type SceneContextType = {
  sceneObjects: SphereType[]
  setSceneObjects: (scene: SphereType[]) => void
  selectedSphereId: string | null
  setSelectedSphereId: (sphere: string) => void
}

export const SceneContext = createContext(
  {} as SceneContextType,
)

export const SceneContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [sceneObjects, setSceneObjects] = useState<
    SphereType[]
  >([])
  const [selectedSphereId, setSelectedSphereId] = useState<
    string | null
  >(null)

  return (
    <SceneContext.Provider
      value={{
        sceneObjects,
        setSceneObjects,
        selectedSphereId,
        setSelectedSphereId,
      }}
    >
      {children}
    </SceneContext.Provider>
  )
}

export const useSceneContext = () =>
  useContext(SceneContext)
