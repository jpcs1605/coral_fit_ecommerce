import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AmorzinhoPage from "./AmorzinhoPage";

export default function RootRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/amorzinho" element={<AmorzinhoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
