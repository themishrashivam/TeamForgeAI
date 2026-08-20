import { useEffect, useState } from "react";
import {
  FaUserEdit,
  FaTimes,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

function BioCard({
  bio,
  skills = [],
  onUpdate,
  saving = false,
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [editedSkills, setEditedSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    setEditedBio(bio || "");
    setEditedSkills(
      Array.isArray(skills) ? [...skills] : []
    );
  }, [bio, skills]);

  const openEdit = () => {
    setEditedBio(bio || "");
    setEditedSkills(
      Array.isArray(skills) ? [...skills] : []
    );
    setNewSkill("");
    setShowEdit(true);
  };

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) {
      return;
    }

    const alreadyExists = editedSkills.some(
      (item) =>
        item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setNewSkill("");
      return;
    }

    setEditedSkills((prev) => [
      ...prev,
      skill,
    ]);

    setNewSkill("");
  };

  const removeSkill = (index) => {
    setEditedSkills((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSkillKeyDown = (e) => {
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

    const cleanedSkills = editedSkills
      .map((skill) => skill.trim())
      .filter(Boolean);

    const result = await onUpdate({
      bio: editedBio.trim(),
      skills: cleanedSkills,
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <span className="text-violet-600 text-xl">
              📝
            </span>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bio
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
            title="Edit Bio"
          >
            <FaUserEdit />
          </button>
        </div>

        <div className="space-y-4">
          <p
            className="
              text-gray-700
              dark:text-gray-300
              leading-7
            "
          >
            {bio?.trim()
              ? bio
              : "No bio added yet. Update your profile to tell others about yourself."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span
                key={index}
                className="
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-medium
                  bg-violet-100
                  text-violet-700
                  dark:bg-violet-900/30
                  dark:text-violet-300
                  hover:scale-105
                  transition
                "
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              No skills added yet
            </span>
          )}
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div
            className="
              w-full
              max-w-2xl
              max-h-[90vh]
              bg-white
              dark:bg-slate-800
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                p-5
                border-b
                border-gray-200
                dark:border-slate-700
              "
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Bio
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Update your bio and skills.
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
              className="
                p-5
                overflow-y-auto
                max-h-[calc(90vh-100px)]
              "
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>

                <textarea
                  value={editedBio}
                  onChange={(e) =>
                    setEditedBio(e.target.value)
                  }
                  rows={6}
                  placeholder="Tell others about yourself..."
                  className="
                    w-full
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
                    resize-none
                    focus:ring-2
                    focus:ring-violet-500
                  "
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) =>
                      setNewSkill(e.target.value)
                    }
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Enter a skill"
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

                <div className="flex flex-wrap gap-2 mt-4">
                  {editedSkills.map(
                    (skill, index) => (
                      <div
                        key={`${skill}-${index}`}
                        className="
                          flex
                          items-center
                          gap-2
                          px-3
                          py-2
                          rounded-full
                          bg-violet-100
                          dark:bg-violet-900/30
                          text-violet-700
                          dark:text-violet-300
                        "
                      >
                        <span className="text-sm font-medium">
                          {skill}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeSkill(index)
                          }
                          className="
                            text-violet-500
                            hover:text-red-500
                            transition
                          "
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() =>
                    setShowEdit(false)
                  }
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
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BioCard;