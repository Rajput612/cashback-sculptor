import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CardDetails from "./pages/CardDetails";
import HowItWorks from "./pages/HowItWorks";
import CardLibrary from "./pages/CardLibrary";
import AboutUs from "./pages/AboutUs";
import SignIn from "./pages/SignIn";
import { Toaster } from "@/components/ui/toaster";

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/card/:cardId" element={<CardDetails />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/card-library" element={<CardLibrary />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App