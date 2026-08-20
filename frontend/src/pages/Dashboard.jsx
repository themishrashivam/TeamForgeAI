import { useEffect, useState } from "react";
import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import StatsSection from "../components/dashboard/StatsSection";
import MyProjectsSection from "../components/dashboard/MyProjectsSection";
import TeamInvitesSection from "../components/dashboard/TeamInvitesSection";
import RecommendedProjectsSection from "../components/dashboard/RecommendedProjectsSection";
import ActivityFeedSection from "../components/dashboard/ActivityFeedSection";
import TaskBoard from "./Taskboard";

function Dashboard() {
  const [user, setUser] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    stats: {},
    myProjects: [],
    recommendedProjects: [],
    invites: [],
  });

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchDashboard();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      setDashboardData(res.data);

      if (res.data.myProjects?.length > 0) {
        setSelectedProjectId(res.data.myProjects[0]._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] dark:bg-gray-900 text-black dark:text-white flex">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Topbar user={user} />

        <div className="p-3 sm:p-4 md:p-6">

          {/* Stats */}
          <StatsSection
            statsData={dashboardData.stats}
            user={user}
          />

          {/* Projects + Invites */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <MyProjectsSection
              projects={dashboardData.myProjects || []}
            />

            <TeamInvitesSection
              invites={dashboardData.invites || []}
            />
          </div>

          {/* Recommended + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <RecommendedProjectsSection
              projects={dashboardData.recommendedProjects || []}
            />

            <ActivityFeedSection
              projects={dashboardData.myProjects || []}
            />
          </div>

          {/* Task Board */}
          {selectedProjectId && (
            <div className="mt-8">
              <TaskBoard projectId={selectedProjectId} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;