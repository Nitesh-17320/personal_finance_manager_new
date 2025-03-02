import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [userName, setUserName] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUserName={setUserName} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login setUserName={setUserName} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
