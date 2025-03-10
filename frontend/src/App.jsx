import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserName(storedUser.name);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default route is Dashboard, but redirect to Login if user is not authenticated */}
        <Route path="/" element={userName ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={userName ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUserName={setUserName} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
