import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPen,
  FaFolderOpen,
  FaUsers,
  FaTimes,
} from "react-icons/fa";

function ProfileHeader({
  user,
  onUpdate,
  saving,
}) {
  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    branch: user?.branch || "",
    year: user?.year || "",
    location: user?.location || "",
    bio: user?.bio || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEdit = () => {
    setFormData({
      name: user?.name || "",
      branch: user?.branch || "",
      year: user?.year || "",
      location: user?.location || "",
      bio: user?.bio || "",
      github: user?.github || "",
      linkedin: user?.linkedin || "",
    });

    setShowEdit(true);
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
          border-gray-200
          dark:border-slate-700
          overflow-hidden
        "
      >
        <div
          className="
            bg-gradient-to-r
            from-violet-50
            to-white
            dark:from-slate-800
            dark:to-slate-900
            px-6
            md:px-10
            py-8
          "
        >
          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8 items-start">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative flex-shrink-0">
                <img
                  src={
                    user?.profileImage ||
                    "https://i.pravatar.cc/300?img=12"
                  }
                  alt="profile"
                  className="
                    w-36
                    h-36
                    md:w-44
                    md:h-44
                    rounded-full
                    border-4
                    border-white
                    dark:border-slate-700
                    shadow-lg
                    object-cover
                  "
                />

                <button
                  type="button"
                  onClick={openEdit}
                  className="
                    absolute
                    bottom-2
                    right-2
                    w-10
                    h-10
                    bg-violet-600
                    text-white
                    rounded-full
                    flex
                    items-center
                    justify-center
                    shadow-md
                    hover:bg-violet-700
                    transition
                  "
                  title="Edit Profile"
                >
                  <FaPen />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h1
                    className="
                      text-3xl
                      md:text-5xl
                      font-bold
                      text-gray-900
                      dark:text-white
                      break-words
                    "
                  >
                    {user?.name || "User Name"}
                  </h1>

                  <button
                    type="button"
                    onClick={openEdit}
                    className="
                      hidden
                      md:flex
                      items-center
                      gap-2
                      px-4
                      py-2
                      rounded-xl
                      border
                      border-violet-200
                      dark:border-violet-800
                      text-violet-600
                      dark:text-violet-400
                      hover:bg-violet-50
                      dark:hover:bg-violet-900/20
                      transition
                    "
                  >
                    <FaPen size={13} />
                    Edit
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span
                    className="
                      text-gray-600
                      dark:text-gray-300
                      text-lg
                    "
                  >
                    {user?.branch ||
                      "Information Technology"}

                    {user?.year &&
                      ` | ${user.year}`}
                  </span>

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      border
                      border-violet-500
                      text-violet-600
                      dark:text-violet-300
                      text-sm
                    "
                  >
                    TeamForge Member
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mt-4
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  <FaMapMarkerAlt />

                  <span>
                    {user?.location ||
                      "Location Not Added"}
                  </span>
                </div>

                <p
                  className="
                    mt-4
                    text-gray-600
                    dark:text-gray-300
                    max-w-2xl
                    leading-relaxed
                  "
                >
                  {user?.bio ||
                    "No bio added yet. Update your profile to tell others about yourself."}
                </p>

                <div className="flex gap-3 mt-5 flex-wrap">
                  {user?.github && (
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-gray-100
                        dark:bg-slate-700
                        dark:text-white
                        flex
                        items-center
                        justify-center
                        hover:bg-gray-200
                        dark:hover:bg-slate-600
                        transition
                      "
                    >
                      <FaGithub />
                    </a>
                  )}

                  {user?.linkedin && (
                    <a
                      href={user.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-gray-100
                        dark:bg-slate-700
                        dark:text-white
                        flex
                        items-center
                        justify-center
                        hover:bg-gray-200
                        dark:hover:bg-slate-600
                        transition
                      "
                    >
                      <FaLinkedin />
                    </a>
                  )}

                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-gray-100
                      dark:bg-slate-700
                      dark:text-white
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaEnvelope />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="
                bg-white
                dark:bg-slate-800
                rounded-2xl
                border
                border-gray-200
                dark:border-slate-700
                p-6
                w-full
                shadow-sm
              "
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="flex gap-4 items-start">
                  <FaFolderOpen className="text-violet-600 text-3xl mt-1" />

                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user?.projects?.length ||
                        user?.projectsCount ||
                        0}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-300">
                      Projects
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <FaUsers className="text-violet-600 text-3xl mt-1" />

                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user?.teamMembersCount ||
                        0}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-300">
                      Team Members
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            border-t
            border-gray-200
            dark:border-slate-700
            px-6
            md:px-8
          "
        >
          <div className="flex gap-10 text-sm font-medium overflow-x-auto">
            <button
              type="button"
              className="
                py-4
                border-b-2
                border-violet-600
                text-violet-600
                whitespace-nowrap
              "
            >
              Overview
            </button>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Profile
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Update your profile information
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
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
                    Year
                  </label>

                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
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
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub
                  </label>

                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
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
                    LinkedIn
                  </label>

                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
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

export default ProfileHeader;