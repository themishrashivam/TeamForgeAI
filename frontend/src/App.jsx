import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import Message from "./pages/Messages.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
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

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/profile/:userId"
          element={<Profile />}
        />

        <Route
          path="/projects"
          element={<MyProjects />}
        />

        <Route
          path="/explore"
          element={<ExploreProjects />}
        />

        <Route
          path="/project/:id"
          element={<ProjectDetails />}
        />


        <Route
          path="/tasks/:projectId"
          element={<TaskBoard />}
        />

        <Route
          path="/requests"
          element={<JoinRequests />}
        />

        <Route path="/messages" element={<Message />} />

        <Route
          path="/logout"
          element={<LandingPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;