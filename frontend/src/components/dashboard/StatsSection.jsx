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
      bg: "bg-violet-100 dark:bg-violet-900/30",
      color: "text-violet-600",
    },
    {
      title: "Team Members",
      count: statsData?.totalTeamMembers || 0,
      subtitle: "Across all projects",
      icon: <FaUsers />,
      bg: "bg-green-100 dark:bg-green-900/30",
      color: "text-green-600",
    },
    {
      title: "Requests Sent",
      count: statsData?.requestsSent || 0,
      subtitle: "Join Requests Sent",
      icon: <FaPaperPlane />,
      bg: "bg-orange-100 dark:bg-orange-900/30",
      color: "text-orange-500",
    },
    {
      title: "Requests Received",
      count: statsData?.requestsReceived || 0,
      subtitle: "Pending Requests",
      icon: <FaUserPlus />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      color: "text-blue-500",
    },
  ];

  return (
    <div
      className="
        bg-white
        dark:bg-slate-800
        rounded-3xl
        p-4
        sm:p-6
        shadow-sm
        border
        border-gray-200
        dark:border-slate-700
      "
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h1
            className="
              text-3xl
              sm:text-4xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            Welcome back, {user?.name || "User"}! 👋
          </h1>

          <p
            className="
              text-gray-500
              dark:text-gray-300
              mt-2
              text-sm
              sm:text-base
            "
          >
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
              bg-white
              dark:bg-slate-800
              border
              border-gray-200
              dark:border-slate-700
              rounded-2xl
              p-5
              hover:shadow-lg
              transition
            "
          >
            <div
              className={`
                w-14 h-14
                rounded-xl
                flex
                items-center
                justify-center
                text-2xl
                ${item.bg}
                ${item.color}
              `}
            >
              {item.icon}
            </div>

            <h2
              className="
                text-4xl
                font-bold
                mt-5
                text-gray-900
                dark:text-white
              "
            >
              {item.count}
            </h2>

            <p
              className="
                font-semibold
                mt-2
                text-gray-800
                dark:text-gray-100
              "
            >
              {item.title}
            </p>

            <p
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsSection;