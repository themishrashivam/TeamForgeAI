import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import ProfileHeader from "../components/profile/ProfileHeader";
import AboutCard from "../components/profile/AboutCard";
import SkillsCard from "../components/profile/SkillsCard";
import TopSkillsCard from "../components/profile/TopSkillsCard";
import EducationCard from "../components/profile/EducationCard";
import BadgesCard from "../components/profile/BadgesCard";
import BioCard from "../components/profile/BioCard";
import ActivityCard from "../components/profile/ActivityCard";

import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");

      console.log(
        "Profile Response:",
        res.data
      );

      setUser(res.data.user);
    } catch (error) {
      console.log(
        "Profile Error:",
        error.response?.data ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-xl font-semibold">
          Loading Profile...
        </h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-xl font-semibold text-red-500">
          Profile Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Topbar */}
        <Topbar user={user} />

        <div className="p-3 sm:p-4 md:p-6 space-y-6">
          {/* Profile Header */}
          <ProfileHeader user={user} />

          {/* Main Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="xl:col-span-4 space-y-6">
              <AboutCard user={user} />

              <BioCard
                bio={user.bio}
              />
            </div>

            {/* Center Column */}
            <div className="xl:col-span-5 space-y-6">
              <SkillsCard
                skills={
                  user.skills || []
                }
              />

              <EducationCard
                education={
                  user.education || []
                }
              />

              <ActivityCard />
            </div>

            {/* Right Column */}
            <div className="xl:col-span-3 space-y-6">
              <TopSkillsCard
                skills={
                  user.skills || []
                }
              />

              <BadgesCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;