import { useEffect, useState } from "react";
import {
  FaGraduationCap,
  FaCalendarAlt,
  FaPen,
  FaTimes,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

function EducationCard({ education = [], onUpdate, saving }) {
  const [showEdit, setShowEdit] = useState(false);
  const [editedEducation, setEditedEducation] = useState([]);

  useEffect(() => {
    setEditedEducation(
      Array.isArray(education)
        ? education.map((item) => ({
            degree: item.degree || "",
            institute: item.institute || "",
            duration: item.duration || "",
            score: item.score || "",
          }))
        : []
    );
  }, [education]);

  const openEdit = () => {
    setEditedEducation(
      Array.isArray(education)
        ? education.map((item) => ({
            degree: item.degree || "",
            institute: item.institute || "",
            duration: item.duration || "",
            score: item.score || "",
          }))
        : []
    );

    setShowEdit(true);
  };

  const addEducation = () => {
    setEditedEducation((prev) => [
      ...prev,
      {
        degree: "",
        institute: "",
        duration: "",
        score: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    setEditedEducation((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleChange = (index, field, value) => {
    setEditedEducation((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!onUpdate) {
      return;
    }

    const cleanedEducation = editedEducation.filter(
      (item) =>
        item.degree.trim() ||
        item.institute.trim() ||
        item.duration.trim() ||
        item.score.trim()
    );

    const result = await onUpdate({
      education: cleanedEducation,
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
            <FaGraduationCap className="text-violet-600 text-xl" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Education
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
            title="Edit Education"
          >
            <FaPen />
          </button>
        </div>

        {education.length > 0 ? (
          <div className="space-y-8">
            {education.map((item, index) => (
              <div
                key={index}
                className="
                  relative
                  pl-8
                  border-l-2
                  border-violet-200
                  dark:border-violet-800
                "
              >
                <div
                  className="
                    absolute
                    -left-[9px]
                    top-1
                    w-4
                    h-4
                    rounded-full
                    bg-violet-600
                    border-2
                    border-white
                    dark:border-slate-800
                  "
                />

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.degree}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {item.institute}
                </p>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mt-2
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  <FaCalendarAlt />
                  <span>{item.duration}</span>
                </div>

                {item.score && (
                  <div
                    className="
                      mt-3
                      inline-block
                      px-3
                      py-1
                      rounded-full
                      bg-violet-100
                      text-violet-700
                      dark:bg-violet-900/30
                      dark:text-violet-300
                      text-sm
                      font-medium
                    "
                  >
                    {item.score}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaGraduationCap className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />

            <p className="text-gray-500 dark:text-gray-400">
              No education details added yet
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
              Add Education
            </button>
          </div>
        )}
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Education
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add or update your education details.
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
              className="p-5 overflow-y-auto max-h-[calc(90vh-90px)]"
            >
              <div className="space-y-5">
                {editedEducation.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No education entries added.
                  </div>
                ) : (
                  editedEducation.map((item, index) => (
                    <div
                      key={index}
                      className="
                        p-5
                        rounded-xl
                        border
                        border-gray-200
                        dark:border-slate-700
                        bg-gray-50
                        dark:bg-slate-900
                      "
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Education {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            removeEducation(index)
                          }
                          className="
                            p-2
                            rounded-lg
                            text-red-500
                            hover:bg-red-50
                            dark:hover:bg-red-900/20
                            transition
                          "
                          title="Delete education"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Degree
                          </label>

                          <input
                            type="text"
                            value={item.degree}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                            placeholder="B.Tech in Information Technology"
                            className="
                              w-full
                              px-4
                              py-3
                              rounded-xl
                              border
                              border-gray-300
                              dark:border-slate-600
                              bg-white
                              dark:bg-slate-800
                              text-gray-900
                              dark:text-white
                              outline-none
                              focus:ring-2
                              focus:ring-violet-500
                            "
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Institute
                          </label>

                          <input
                            type="text"
                            value={item.institute}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "institute",
                                e.target.value
                              )
                            }
                            placeholder="College / University name"
                            className="
                              w-full
                              px-4
                              py-3
                              rounded-xl
                              border
                              border-gray-300
                              dark:border-slate-600
                              bg-white
                              dark:bg-slate-800
                              text-gray-900
                              dark:text-white
                              outline-none
                              focus:ring-2
                              focus:ring-violet-500
                            "
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Duration
                            </label>

                            <input
                              type="text"
                              value={item.duration}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "duration",
                                  e.target.value
                                )
                              }
                              placeholder="2023 - 2027"
                              className="
                                w-full
                                px-4
                                py-3
                                rounded-xl
                                border
                                border-gray-300
                                dark:border-slate-600
                                bg-white
                                dark:bg-slate-800
                                text-gray-900
                                dark:text-white
                                outline-none
                                focus:ring-2
                                focus:ring-violet-500
                              "
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Score
                            </label>

                            <input
                              type="text"
                              value={item.score}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "score",
                                  e.target.value
                                )
                              }
                              placeholder="8.5 CGPA"
                              className="
                                w-full
                                px-4
                                py-3
                                rounded-xl
                                border
                                border-gray-300
                                dark:border-slate-600
                                bg-white
                                dark:bg-slate-800
                                text-gray-900
                                dark:text-white
                                outline-none
                                focus:ring-2
                                focus:ring-violet-500
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={addEducation}
                className="
                  mt-5
                  w-full
                  py-3
                  rounded-xl
                  border-2
                  border-dashed
                  border-violet-300
                  dark:border-violet-700
                  text-violet-600
                  dark:text-violet-400
                  hover:bg-violet-50
                  dark:hover:bg-violet-900/20
                  transition
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <FaPlus />
                Add Education
              </button>

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

export default EducationCard;