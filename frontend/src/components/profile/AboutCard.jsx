import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPen,
  FaTimes,
} from "react-icons/fa";

function AboutCard({ user, onUpdate, saving }) {
  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    bio: "",
    phone: "",
    college: "",
    branch: "",
    location: "",
  });

  useEffect(() => {
    setFormData({
      bio: user?.bio || "",
      phone: user?.phone || "",
      college: user?.college || "",
      branch: user?.branch || "",
      location: user?.location || "",
    });
  }, [user]);

  const openEdit = () => {
    setFormData({
      bio: user?.bio || "",
      phone: user?.phone || "",
      college: user?.college || "",
      branch: user?.branch || "",
      location: user?.location || "",
    });

    setShowEdit(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await onUpdate(formData);

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
            <FaGraduationCap className="text-violet-600 text-lg" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              About Me
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
              transition
              p-2
              rounded-lg
              hover:bg-violet-50
              dark:hover:bg-violet-900/20
            "
            title="Edit About"
          >
            <FaPen />
          </button>
        </div>

        <p
          className="
            text-gray-600
            dark:text-gray-300
            leading-8
            text-sm
          "
        >
          {user?.bio || "No bio added yet."}
        </p>

        <div className="mt-8 space-y-5">
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-gray-500 dark:text-gray-400 flex-shrink-0" />

            <span className="font-medium text-gray-700 dark:text-gray-200 w-20">
              Email
            </span>

            <span className="text-gray-500 dark:text-gray-300 break-all">
              {user?.email || "Not Added"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <FaPhone className="text-gray-500 dark:text-gray-400 flex-shrink-0" />

            <span className="font-medium text-gray-700 dark:text-gray-200 w-20">
              Phone
            </span>

            <span className="text-gray-500 dark:text-gray-300">
              {user?.phone || "Not Added"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <FaUniversity className="text-gray-500 dark:text-gray-400 flex-shrink-0" />

            <span className="font-medium text-gray-700 dark:text-gray-200 w-20">
              College
            </span>

            <span className="text-gray-500 dark:text-gray-300">
              {user?.college || "Not Added"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <FaGraduationCap className="text-gray-500 dark:text-gray-400 flex-shrink-0" />

            <span className="font-medium text-gray-700 dark:text-gray-200 w-20">
              Branch
            </span>

            <span className="text-gray-500 dark:text-gray-300">
              {user?.branch || "Not Added"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-gray-500 dark:text-gray-400 flex-shrink-0" />

            <span className="font-medium text-gray-700 dark:text-gray-200 w-20">
              Location
            </span>

            <span className="text-gray-500 dark:text-gray-300">
              {user?.location || "Not Added"}
            </span>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit About Me
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Update your personal information
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
              className="p-5 space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
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
                    focus:ring-2
                    focus:ring-violet-500
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  College
                </label>

                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college name"
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
                    focus:ring-2
                    focus:ring-violet-500
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Branch
                </label>

                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Information Technology"
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
                    focus:ring-2
                    focus:ring-violet-500
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Lucknow, India"
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
                    focus:ring-2
                    focus:ring-violet-500
                  "
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
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

export default AboutCard;