import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SceneContextProvider } from "./contexts/Scene";
import { ShaderSceneContextProvider } from "./contexts/ShaderScene";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ShaderedApp } from "./ShaderedApp";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <SceneContextProvider>
    <ShaderSceneContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ShaderedApp />} />
        </Routes>
      </BrowserRouter>
    </ShaderSceneContextProvider>
  </SceneContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
