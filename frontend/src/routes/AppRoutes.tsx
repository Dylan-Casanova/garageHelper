import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
import PrivateRoute from "./PrivateRoute";

interface AppRoutesProps {
  userEmail: string;
  onLogout: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ userEmail, onLogout }) => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home userEmail={userEmail} onLogout={onLogout} />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
