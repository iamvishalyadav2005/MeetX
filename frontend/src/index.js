import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Safe process polyfill for simple-peer / readable-stream
if (!window.process) {
  window.process = { env: { NODE_ENV: "production" } };
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

reportWebVitals();