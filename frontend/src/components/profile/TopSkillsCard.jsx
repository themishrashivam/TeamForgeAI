import {
  FaReact,
  FaNodeJs,
  FaJava,
  FaGitAlt,
} from "react-icons/fa";
import { SiMongodb, SiExpress } from "react-icons/si";

function TopSkillsCard({ skills = [] }) {
  const getSkillInfo = (skill) => {
    const skillMap = {
      React: {
        icon: <FaReact />,
        color: "text-blue-500",
      },
      "React.js": {
        icon: <FaReact />,
        color: "text-blue-500",
      },
      "Node.js": {
        icon: <FaNodeJs />,
        color: "text-green-500",
      },
      Express: {
        icon: <SiExpress />,
        color: "text-gray-700 dark:text-gray-300",
      },
      "Express.js": {
        icon: <SiExpress />,
        color: "text-gray-700 dark:text-gray-300",
      },
      MongoDB: {
        icon: <SiMongodb />,
        color: "text-emerald-500",
      },
      Java: {
        icon: <FaJava />,
        color: "text-orange-500",
      },
      Git: {
        icon: <FaGitAlt />,
        color: "text-red-500",
      },
      GitHub: {
        icon: <FaGitAlt />,
        color: "text-red-500",
      },
    };

    return (
      skillMap[skill] || {
        icon: "🚀",
        color: "text-violet-500",
      }
    );
  };

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
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🔥</span>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Top Skills
        </h2>
      </div>

      {/* Skills */}
      {skills.length > 0 ? (
        <div className="space-y-4">
          {skills.slice(0, 5).map((skill, index) => {
            const skillInfo = getSkillInfo(skill);

            return (
              <div
                key={index}
                className="
                  flex
                  items-center
                  justify-between
                  p-4
                  rounded-xl
                  bg-gray-50
                  dark:bg-slate-700
                  hover:bg-gray-100
                  dark:hover:bg-slate-600
                  transition
                "
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${skillInfo.color}`}>
                    {skillInfo.icon}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {skill}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Core Skill
                    </p>
                  </div>
                </div>

                <div
                  className="
                    px-3
                    py-1
                    bg-violet-100
                    dark:bg-violet-900/30
                    text-violet-700
                    dark:text-violet-300
                    rounded-full
                    text-sm
                    font-medium
                  "
                >
                  Expert
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No skills added yet
          </p>
        </div>
      )}
    </div>
  );
}

export default TopSkillsCard;