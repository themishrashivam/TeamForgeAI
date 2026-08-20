import {
  FaReact,
  FaNodeJs,
  FaJava,
  FaGitAlt,
} from "react-icons/fa";
import { SiMongodb, SiExpress } from "react-icons/si";

function TopSkillsCard({ skills = [] }) {
  const getSkillInfo = (skill) => {
    const normalizedSkill = skill
      ?.trim()
      .toLowerCase();

    const skillMap = {
      react: {
        icon: <FaReact />,
        color: "text-blue-500",
      },
      "react.js": {
        icon: <FaReact />,
        color: "text-blue-500",
      },
      "node.js": {
        icon: <FaNodeJs />,
        color: "text-green-500",
      },
      node: {
        icon: <FaNodeJs />,
        color: "text-green-500",
      },
      express: {
        icon: <SiExpress />,
        color: "text-gray-700 dark:text-gray-300",
      },
      "express.js": {
        icon: <SiExpress />,
        color: "text-gray-700 dark:text-gray-300",
      },
      mongodb: {
        icon: <SiMongodb />,
        color: "text-emerald-500",
      },
      java: {
        icon: <FaJava />,
        color: "text-orange-500",
      },
      git: {
        icon: <FaGitAlt />,
        color: "text-red-500",
      },
      github: {
        icon: <FaGitAlt />,
        color: "text-gray-800 dark:text-gray-200",
      },
    };

    return (
      skillMap[normalizedSkill] || {
        icon: "🚀",
        color: "text-violet-500",
      }
    );
  };

  const getSkillLevel = (index) => {
    const levels = [
      "Expert",
      "Advanced",
      "Advanced",
      "Intermediate",
      "Intermediate",
    ];

    return levels[index] || "Intermediate";
  };

  const topSkills = skills
    .filter(
      (skill) =>
        typeof skill === "string" &&
        skill.trim()
    )
    .slice(0, 5);

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            🔥
          </span>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Top Skills
          </h2>
        </div>
      </div>

      {topSkills.length > 0 ? (
        <div className="space-y-4">
          {topSkills.map((skill, index) => {
            const skillInfo =
              getSkillInfo(skill);

            return (
              <div
                key={`${skill}-${index}`}
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  p-4
                  rounded-xl
                  bg-gray-50
                  dark:bg-slate-700
                  hover:bg-gray-100
                  dark:hover:bg-slate-600
                  transition
                "
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`
                      text-2xl
                      flex-shrink-0
                      ${skillInfo.color}
                    `}
                  >
                    {skillInfo.icon}
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="
                        font-semibold
                        text-gray-800
                        dark:text-white
                        truncate
                      "
                    >
                      {skill}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Core Skill
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex-shrink-0
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
                  {getSkillLevel(index)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">
            🔥
          </div>

          <p className="text-gray-500 dark:text-gray-400">
            No skills added yet
          </p>

          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Add skills to your profile to see them here.
          </p>
        </div>
      )}
    </div>
  );
}

export default TopSkillsCard;