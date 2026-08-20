import { useEffect, useState } from "react";
import {
  FaReact,
  FaNodeJs,
  FaJava,
  FaDatabase,
  FaGitAlt,
  FaPen,
  FaTimes,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { SiMongodb, SiExpress } from "react-icons/si";

function SkillsCard({ skills = [], onUpdate, saving }) {
  const [showEdit, setShowEdit] = useState(false);
  const [editedSkills, setEditedSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    setEditedSkills(Array.isArray(skills) ? [...skills] : []);
  }, [skills]);

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
      Node: {
        icon: <FaNodeJs />,
        level: 85,
        color: "bg-green-500",
      },
      Express: {
        icon: <SiExpress />,
        level: 80,
        color: "bg-gray-700 dark:bg-gray-400",
      },
      "Express.js": {
        icon: <SiExpress />,
        level: 80,
        color: "bg-gray-700 dark:bg-gray-400",
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

  const openEdit = () => {
    setEditedSkills(Array.isArray(skills) ? [...skills] : []);
    setNewSkill("");
    setShowEdit(true);
  };

  const removeSkill = (index) => {
    setEditedSkills((prev) =>
      prev.filter((_, skillIndex) => skillIndex !== index)
    );
  };

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) {
      return;
    }

    const alreadyExists = editedSkills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      return;
    }

    setEditedSkills((prev) => [...prev, skill]);
    setNewSkill("");
  };

  const handleAddSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!onUpdate) {
      return;
    }

    const result = await onUpdate({
      skills: editedSkills,
    });

    if (result?.success) {
      setShowEdit(false);
    }
  };

  return (
    <>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Skills
            </h2>
          </div>

          <button
            type="button"
            onClick={openEdit}
            className="
              text-violet-600
              hover:text-violet-700
              dark:text-violet-400
              dark:hover:text-violet-300
              p-2
              rounded-lg
              hover:bg-violet-50
              dark:hover:bg-violet-900/20
              transition
            "
            title="Edit Skills"
          >
            <FaPen />
          </button>
        </div>

        {skills.length > 0 ? (
          <div className="space-y-6">
            {skills.map((skill, index) => {
              const skillData = getSkillData(skill);

              return (
                <div
                  key={`${skill}-${index}`}
                  className="
                    p-3
                    rounded-xl
                    hover:bg-gray-50
                    dark:hover:bg-slate-700
                    transition
                  "
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-violet-600">
                        {skillData.icon}
                      </span>

                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {skill}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                      {skillData.level}%
                    </span>
                  </div>

                  <div
                    className="
                      w-full
                      bg-gray-200
                      dark:bg-slate-700
                      rounded-full
                      h-3
                      overflow-hidden
                    "
                  >
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
            <p className="text-gray-500 dark:text-gray-400">
              No skills added yet
            </p>

            <button
              type="button"
              onClick={openEdit}
              className="
                mt-4
                px-4
                py-2
                rounded-lg
                bg-violet-600
                hover:bg-violet-700
                text-white
                text-sm
                transition
              "
            >
              Add Skills
            </button>
          </div>
        )}
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Skills
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add or remove your technical skills.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="
                  p-2
                  rounded-lg
                  hover:bg-gray-100
                  dark:hover:bg-slate-700
                  text-gray-500
                  dark:text-gray-300
                "
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) =>
                    setNewSkill(e.target.value)
                  }
                  onKeyDown={handleAddSkillKeyDown}
                  placeholder="Enter a skill e.g. React"
                  className="
                    flex-1
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-gray-300
                    dark:border-slate-600
                    bg-white
                    dark:bg-slate-900
                    text-gray-900
                    dark:text-white
                    outline-none
                    focus:ring-2
                    focus:ring-violet-500
                  "
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="
                    px-4
                    py-3
                    rounded-xl
                    bg-violet-600
                    hover:bg-violet-700
                    text-white
                    transition
                  "
                >
                  <FaPlus />
                </button>
              </div>

              <div className="mt-5 max-h-64 overflow-y-auto space-y-2">
                {editedSkills.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No skills added.
                  </div>
                ) : (
                  editedSkills.map((skill, index) => (
                    <div
                      key={`${skill}-${index}`}
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        p-3
                        rounded-xl
                        bg-gray-50
                        dark:bg-slate-900
                        border
                        border-gray-200
                        dark:border-slate-700
                      "
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-violet-600">
                          {getSkillData(skill).icon}
                        </span>

                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {skill}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeSkill(index)
                        }
                        className="
                          p-2
                          rounded-lg
                          text-red-500
                          hover:bg-red-50
                          dark:hover:bg-red-900/20
                          transition
                        "
                        title="Remove skill"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="
                    px-5
                    py-3
                    rounded-xl
                    border
                    border-gray-300
                    dark:border-slate-600
                    text-gray-700
                    dark:text-gray-300
                    hover:bg-gray-100
                    dark:hover:bg-slate-700
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    px-6
                    py-3
                    rounded-xl
                    bg-violet-600
                    hover:bg-violet-700
                    text-white
                    font-medium
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    transition
                  "
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SkillsCard;