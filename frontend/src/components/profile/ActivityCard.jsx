import {
  FaFolderOpen,
  FaUsers,
  FaPaperPlane,
  FaUserEdit,
} from "react-icons/fa";

function ActivityCard({ user }) {
  const activities = [];

  // Profile Update
  if (user?.updatedAt) {
    activities.push({
      icon: <FaUserEdit />,
      title: "Profile information updated",
      time: new Date(
        user.updatedAt
      ).toLocaleDateString(),
      bg: "bg-green-100",
      color: "text-green-600",
    });
  }

  // Projects
  activities.push({
    icon: <FaFolderOpen />,
    title: `Created ${
      user?.projectsCount || 0
    } project(s)`,
    time: "Current",
    bg: "bg-orange-100",
    color: "text-orange-500",
  });

  // Team Members
  activities.push({
    icon: <FaUsers />,
    title: `${
      user?.teamMembersCount || 0
    } team member(s) connected`,
    time: "Current",
    bg: "bg-purple-100",
    color: "text-purple-600",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-violet-600 text-xl">
            ⚡
          </span>

          <h2 className="text-2xl font-bold text-gray-900">
            Recent Activity
          </h2>
        </div>
      </div>

      <div className="space-y-5">

        {activities.map(
          (activity, index) => (
            <div
              key={index}
              className="
                flex items-start gap-4
                pb-4 border-b border-gray-100
                last:border-none
              "
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${activity.bg} ${activity.color}`}
              >
                {activity.icon}
              </div>

              <div className="flex-1">
                <p className="text-gray-700 text-sm leading-6">
                  {activity.title}
                </p>
              </div>

              <span className="text-xs text-gray-400 whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          )
        )}

      </div>
    </div>
  );
}

export default ActivityCard;