import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ProjectBugsPage from "./pages/ProjectBugs";
import UpdatestatusPage from "./pages/BugDetail";
import AccountTypePage from "./pages/AccountTypePage";
import ProjectsDashboard from "./pages/ProjectsDashboard";
import AllBugsPage from "./pages/AllBugsPage";
import ProfilePage from "./pages/Profilepage";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/get-started" element={<AccountTypePage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/manager"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <ProjectsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/qa"
              element={
                <ProtectedRoute allowedRoles={["qa"]}>
                  <ProjectsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/developer"
              element={
                <ProtectedRoute allowedRoles={["developer"]}>
                  <ProjectsDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bugs"
              element={
                <ProtectedRoute>
                  <AllBugsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId/bugs"
              element={
                <ProtectedRoute>
                  <ProjectBugsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId/bugs/:bugId"
              element={
                <ProtectedRoute>
                  <UpdatestatusPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
