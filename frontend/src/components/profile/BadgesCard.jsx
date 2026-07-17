import {
  FaCode,
  FaUsers,
  FaStar,
  FaShieldAlt,
} from "react-icons/fa";

function BadgesCard({ user }) {
  const badges = [
    {
      title: "TeamForge Member",
      icon: <FaUsers />,
      color: "from-purple-600 to-fuchsia-500",
    },
    {
      title: "Problem Solver",
      icon: <FaStar />,
      color: "from-amber-500 to-orange-500",
    },
  ];

  // Skill-based badge
  if (user?.skills?.length >= 3) {
    badges.unshift({
      title: "Skilled Developer",
      icon: <FaCode />,
      color: "from-violet-600 to-purple-500",
    });
  }

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
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <FaShieldAlt className="text-violet-600 text-lg" />

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Badges
          </h2>
        </div>

        <button className="text-violet-600 font-medium hover:text-violet-700 transition">
          View All
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="
              flex
              flex-col
              items-center
              text-center
              p-4
              rounded-2xl
              hover:bg-gray-50
              dark:hover:bg-slate-700
              transition
            "
          >
            <div
              className={`
                w-24
                h-24
                rounded-full
                bg-gradient-to-br
                ${badge.color}
                flex
                items-center
                justify-center
                text-white
                text-4xl
                shadow-lg
              `}
            >
              {badge.icon}
            </div>

            <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">
              {badge.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BadgesCard;