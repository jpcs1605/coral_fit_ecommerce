import React from "react";
import { createRoot } from "react-dom/client";
import { RomanticGame } from "./components/RomanticGame";

const container = document.getElementById("romantic-game-root");
if (container) {
  const root = createRoot(container);
  root.render(<RomanticGame />);
}
