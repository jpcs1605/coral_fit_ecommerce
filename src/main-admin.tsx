import { createRoot } from "react-dom/client";
import { AdminPanel } from "./components/AdminPanel.tsx";
import "./index.css";

createRoot(document.getElementById("admin-root")!).render(<AdminPanel />);
