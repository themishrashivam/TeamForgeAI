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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");

      console.log("Profile Response:", res.data);

      setUser(res.data.user);
    } catch (error) {
      console.log(
        "Profile Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      setSaving(true);

      const res = await api.put(
        "/profile",
        updatedData
      );

      console.log(
        "Updated Profile:",
        res.data
      );

      if (res.data.user) {
        setUser(res.data.user);
      } else if (res.data.data) {
        setUser(res.data.data);
      } else {
        await fetchProfile();
      }

      return {
        success: true,
        message:
          res.data.message ||
          "Profile updated successfully",
      };
    } catch (error) {
      console.log(
        "Update Profile Error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to update profile",
      };
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Loading Profile...
        </h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-red-500">
          Profile Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-slate-900 flex">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Topbar user={user} />

        <div className="p-3 sm:p-4 md:p-6 space-y-6">
          <ProfileHeader
            user={user}
            onUpdate={updateProfile}
            saving={saving}
          />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-4 space-y-6">
              <AboutCard
                user={user}
                onUpdate={updateProfile}
                saving={saving}
              />

              <BioCard
                bio={user.bio}
                user={user}
                onUpdate={updateProfile}
                saving={saving}
              />
            </div>

            <div className="xl:col-span-5 space-y-6">
              <SkillsCard
                skills={user.skills || []}
                user={user}
                onUpdate={updateProfile}
                saving={saving}
              />

              <EducationCard
                education={user.education || []}
                user={user}
                onUpdate={updateProfile}
                saving={saving}
              />

              <ActivityCard
                user={user}
              />
            </div>

            <div className="xl:col-span-3 space-y-6">
              <TopSkillsCard
                skills={user.skills || []}
                user={user}
                onUpdate={updateProfile}
                saving={saving}
              />

              <BadgesCard
                user={user}
                onUpdate={updateProfile}
                saving={saving}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;