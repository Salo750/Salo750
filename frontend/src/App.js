import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Capture from "@/pages/Capture";
import Dashboard from "@/pages/Dashboard";
import LeadDetail from "@/pages/LeadDetail";

function App() {
  return (
    <div className="App min-h-screen bg-zinc-950 text-zinc-50">
      <BrowserRouter>
        <Navbar />
        <main data-testid="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/capture" element={<Capture />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
          </Routes>
        </main>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#18181b",
              color: "#fafafa",
              border: "1px solid #27272a",
              borderRadius: "2px",
            },
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
