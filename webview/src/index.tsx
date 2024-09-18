import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "app";

const container = document.querySelector("#root") as HTMLElement;
const root = createRoot(container);

// TODO: remove react strict mode

root.render(<App />);
