import {
  FaFolder,
  FaUsers,
  FaPaperPlane,
  FaUserPlus,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function StatsSection({ statsData, user }) {
  const navigate = useNavigate();

  const stats = [
    {
      title: "My Projects",
      count: statsData?.totalProjects || 0,
      subtitle: "Your Projects",
      icon: <FaFolder />,
      bg: "bg-violet-100",
      color: "text-violet-600",
    },
    {
      title: "Team Members",
      count: statsData?.totalTeamMembers || 0,
      subtitle: "Across all projects",
      icon: <FaUsers />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Requests Sent",
      count: statsData?.requestsSent || 0,
      subtitle: "Join Requests Sent",
      icon: <FaPaperPlane />,
      bg: "bg-orange-100",
      color: "text-orange-500",
    },
    {
      title: "Requests Received",
      count: statsData?.requestsReceived || 0,
      subtitle: "Pending Requests",
      icon: <FaUserPlus />,
      bg: "bg-blue-100",
      color: "text-blue-500",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            Welcome back, {user?.name || "User"}! 👋
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Let's build something amazing together today.
          </p>
        </div>

        <button
          onClick={() => navigate("/projects")}
          className="
            w-full
            sm:w-auto
            bg-violet-600
            text-white
            px-6
            py-3
            rounded-xl
            hover:bg-violet-700
            transition
          "
        >
          + Create Project
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="
              border
              rounded-2xl
              p-5
              hover:shadow-md
              transition
            "
          >
            <div
              className={`
                w-12 h-12 sm:w-14 sm:h-14
                rounded-xl
                flex
                items-center
                justify-center
                text-xl sm:text-2xl
                ${item.bg}
                ${item.color}
              `}
            >
              {item.icon}
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mt-5">
              {item.count}
            </h2>

            <p className="font-medium mt-2">
              {item.title}
            </p>

            <p className="text-gray-500 text-sm">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsSection;