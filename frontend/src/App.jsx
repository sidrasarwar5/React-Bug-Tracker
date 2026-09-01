import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ManagerPage from "./pages/manager"; 
import QaPage from "./pages/Qa";
import DeveloperPage from "./pages/developer";
import CreateBugPage from "./pages/CreateBug";
import ProjectBugsPage from "./pages/ProjectBugs";
import UpdatestatusPage from "./pages/UpdateStatus";
import AccountTypePage from "./pages/AccountTypePage";

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
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="/manager" element={<ManagerPage />} />
          <Route path="/qa" element={<QaPage />} />
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
