import { useState } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "../components/Auth/LoginForm";
import React from 'react'

const Landing = () => {

  // Check if token exists in localStorage
  const token = localStorage.getItem("token");

  // If user is authenticated, redirect to home
  if (token) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Landing;
