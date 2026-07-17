import {
  FaFolderOpen,
  FaUsers,
  FaUserEdit,
} from "react-icons/fa";

function ActivityCard({ user }) {
  const activities = [];

  // Profile Update
  if (user?.updatedAt) {
    activities.push({
      icon: <FaUserEdit />,
      title: "Profile information updated",
      time: new Date(user.updatedAt).toLocaleDateString(),
      bg: "bg-green-100 dark:bg-green-900/30",
      color: "text-green-600",
    });
  }

  // Projects
  activities.push({
    icon: <FaFolderOpen />,
    title: `Created ${user?.projectsCount || 0} project(s)`,
    time: "Current",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    color: "text-orange-500",
  });

  // Team Members
  activities.push({
    icon: <FaUsers />,
    title: `${user?.teamMembersCount || 0} team member(s) connected`,
    time: "Current",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    color: "text-purple-600",
  });

  return (
    <div
      className="
        bg-white
        dark:bg-slate-800
        rounded-2xl
        border
        border-gray-100
        dark:border-slate-700
        shadow-sm
        p-6
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-violet-600 text-xl">⚡</span>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-5">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="
              flex
              items-start
              gap-4
              pb-4
              border-b
              border-gray-100
              dark:border-slate-700
              last:border-none
            "
          >
            {/* Icon */}
            <div
              className={`
                w-12
                h-12
                rounded-xl
                flex
                items-center
                justify-center
                text-lg
                ${activity.bg}
                ${activity.color}
              `}
            >
              {activity.icon}
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-200 text-sm leading-6">
                {activity.title}
              </p>
            </div>

            {/* Time */}
            <span
              className="
                text-xs
                text-gray-400
                dark:text-gray-500
                whitespace-nowrap
              "
            >
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityCard;