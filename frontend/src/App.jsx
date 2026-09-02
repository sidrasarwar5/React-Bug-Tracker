import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import CreateBugPage from "./pages/CreateBug";
import ProjectBugsPage from "./pages/ProjectBugs";
import UpdatestatusPage from "./pages/UpdateStatus";
import AccountTypePage from "./pages/AccountTypePage";
import ProjectsDashboard from "./pages/ProjectsDashboard";

// import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/get-started" element={<AccountTypePage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/manager" element={<ProjectsDashboard />} />
          <Route path="/qa" element={<ProjectsDashboard />} />
          <Route path="/developer" element={<ProjectsDashboard />} />
          <Route path="/projects/:projectId" element={<CreateBugPage />} />
          <Route
            path="/projects/:projectId/bugs"
            element={<ProjectBugsPage />}
          />
          <Route
            path="/projects/:projectId/bugs/:bugId"
            element={<UpdatestatusPage />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
