import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { useThemeStore } from "./store/themeStore";
import "./index.css";

useThemeStore.getState().init();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </BrowserRouter>
  </React.StrictMode>
);
