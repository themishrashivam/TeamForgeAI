import {
  FaFolderOpen,
  FaUsers,
  FaUserEdit,
  FaCode,
  FaProjectDiagram,
} from "react-icons/fa";

function ActivityCard({ user }) {
  const activities = [];

  if (user?.updatedAt) {
    activities.push({
      icon: <FaUserEdit />,
      title: "Profile information updated",
      time: new Date(
        user.updatedAt
      ).toLocaleDateString(),
      bg: "bg-green-100 dark:bg-green-900/30",
      color: "text-green-600",
      date: new Date(user.updatedAt),
    });
  }

  if (user?.projectsCount > 0) {
    activities.push({
      icon: <FaFolderOpen />,
      title: `Created ${user.projectsCount} project${
        user.projectsCount > 1 ? "s" : ""
      }`,
      time: "Projects",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      color: "text-orange-500",
      date: user?.createdAt
        ? new Date(user.createdAt)
        : new Date(0),
    });
  }

  if (user?.teamMembersCount > 0) {
    activities.push({
      icon: <FaUsers />,
      title: `${user.teamMembersCount} team member${
        user.teamMembersCount > 1 ? "s" : ""
      } connected`,
      time: "Team",
      bg: "bg-purple-100 dark:bg-purple-900/30",
      color: "text-purple-600",
      date: user?.updatedAt
        ? new Date(user.updatedAt)
        : new Date(0),
    });
  }

  if (user?.skills?.length > 0) {
    activities.push({
      icon: <FaCode />,
      title: `Added ${user.skills.length} skill${
        user.skills.length > 1 ? "s" : ""
      } to profile`,
      time: "Skills",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      color: "text-blue-600",
      date: user?.updatedAt
        ? new Date(user.updatedAt)
        : new Date(0),
    });
  }

  if (user?.projects?.length > 0) {
    activities.push({
      icon: <FaProjectDiagram />,
      title: `Working on ${user.projects.length} project${
        user.projects.length > 1 ? "s" : ""
      }`,
      time: "Projects",
      bg: "bg-violet-100 dark:bg-violet-900/30",
      color: "text-violet-600",
      date: user?.updatedAt
        ? new Date(user.updatedAt)
        : new Date(0),
    });
  }

  activities.sort(
    (a, b) => b.date - a.date
  );

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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-violet-600 text-xl">
            ⚡
          </span>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center">
          <FaProjectDiagram className="mx-auto text-4xl text-gray-300 dark:text-gray-600" />

          <p className="mt-3 text-gray-500 dark:text-gray-400">
            No recent activity
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {activities.map(
            (activity, index) => (
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
                <div
                  className={`
                    w-12
                    h-12
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    text-lg
                    flex-shrink-0
                    ${activity.bg}
                    ${activity.color}
                  `}
                >
                  {activity.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 dark:text-gray-200 text-sm leading-6">
                    {activity.title}
                  </p>
                </div>

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
            )
          )}
        </div>
      )}
    </div>
  );
}

export default ActivityCard;