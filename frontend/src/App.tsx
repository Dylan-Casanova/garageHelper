// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import React, { useState, useEffect } from "react";

function App() {
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUserEmail("");
  };

  return (
    <BrowserRouter basename="/garageHelper">
      <AppRoutes userEmail={userEmail} onLogout={handleLogout} />
    </BrowserRouter>
  );
}

export default App;
