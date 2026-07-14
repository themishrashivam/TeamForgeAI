import {
  FaReact,
  FaNodeJs,
  FaJava,
  FaDatabase,
  FaGitAlt,
} from "react-icons/fa";
import { SiMongodb, SiExpress } from "react-icons/si";

function SkillsCard({ skills = [] }) {

  const getSkillData = (skill) => {
    const skillMap = {
      React: {
        icon: <FaReact />,
        level: 90,
        color: "bg-blue-500",
      },
      "React.js": {
        icon: <FaReact />,
        level: 90,
        color: "bg-blue-500",
      },
      "Node.js": {
        icon: <FaNodeJs />,
        level: 85,
        color: "bg-green-500",
      },
      Express: {
        icon: <SiExpress />,
        level: 80,
        color: "bg-gray-700",
      },
      "Express.js": {
        icon: <SiExpress />,
        level: 80,
        color: "bg-gray-700",
      },
      MongoDB: {
        icon: <SiMongodb />,
        level: 85,
        color: "bg-emerald-500",
      },
      Java: {
        icon: <FaJava />,
        level: 88,
        color: "bg-orange-500",
      },
      SQL: {
        icon: <FaDatabase />,
        level: 80,
        color: "bg-purple-500",
      },
      Git: {
        icon: <FaGitAlt />,
        level: 75,
        color: "bg-red-500",
      },
      GitHub: {
        icon: <FaGitAlt />,
        level: 75,
        color: "bg-red-500",
      },
    };

    return (
      skillMap[skill] || {
        icon: "🚀",
        level: 70,
        color: "bg-violet-500",
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-2xl">🚀</span>

        <h2 className="text-2xl font-bold text-gray-900">
          Skills
        </h2>
      </div>

      {/* Skills List */}
      {skills.length > 0 ? (
        <div className="space-y-6">

          {skills.map((skill, index) => {
            const skillData = getSkillData(skill);

            return (
              <div key={index}>

                <div className="flex justify-between items-center mb-2">

                  <div className="flex items-center gap-3">
                    <span className="text-xl text-violet-600">
                      {skillData.icon}
                    </span>

                    <span className="font-medium text-gray-700">
                      {skill}
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-gray-500">
                    {skillData.level}%
                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${skillData.color}`}
                    style={{
                      width: `${skillData.level}%`,
                    }}
                  />
                </div>

              </div>
            );
          })}

        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No skills added yet
          </p>
        </div>
      )}

    </div>
  );
}

export default SkillsCard;