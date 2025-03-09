
import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CardDetails from "./pages/CardDetails";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/card/:cardId" element={<CardDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
