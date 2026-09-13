import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyProjects from "./pages/MyProjects";
import ExploreProjects from "./pages/ExploreProjects";
import LandingPage from "./pages/LandingPage";
import ProjectDetails from "./pages/ProjectDetails";
import JoinRequests from "./pages/JoinRequests";
import TaskBoard from "./pages/Taskboard.jsx";
import Message from "./pages/Messages.jsx";

// Password Reset Pages
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Forgot Password */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Reset Password */}
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/profile/:userId"
          element={<Profile />}
        />

        {/* Projects */}
        <Route
          path="/projects"
          element={<MyProjects />}
        />

        <Route
          path="/explore"
          element={<ExploreProjects />}
        />

        {/* Requests */}
        <Route
          path="/requests"
          element={<JoinRequests />}
        />

        {/* Messages */}
        <Route
          path="/messages"
          element={<Message />}
        />

        {/* Project Details */}
        <Route
          path="/project/:id"
          element={<ProjectDetails />}
        />

        {/* Task Board */}
        <Route
          path="/project/:id/tasks"
          element={<TaskBoard />}
        />

        {/* Logout */}
        <Route
          path="/logout"
          element={<LandingPage />}
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<LandingPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;