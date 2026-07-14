import {
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPen,
  FaFolderOpen,
  FaUsers,
} from "react-icons/fa";

function ProfileHeader({ user }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Background */}
      <div className="bg-gradient-to-r from-violet-50 to-white px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8 items-start">

          {/* Left Section */}
          <div className="flex flex-col md:flex-row items-start gap-6">

            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <img
                src={
                  user?.profileImage ||
                  "https://i.pravatar.cc/300?img=12"
                }
                alt="profile"
                className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white shadow-lg object-cover"
              />

              <button className="absolute bottom-2 right-2 w-10 h-10 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-md">
                <FaPen />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">

              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 break-words">
                {user?.name || "User Name"}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-3">

                <span className="text-gray-600 text-lg">
                  {user?.branch || "Information Technology"}
                  {user?.year && ` | ${user.year}`}
                </span>

                <span className="px-3 py-1 rounded-full border border-violet-500 text-violet-600 text-sm">
                  TeamForge Member
                </span>

              </div>

              <div className="flex items-center gap-2 mt-4 text-gray-500">
                <FaMapMarkerAlt />
                <span>
                  {user?.location ||
                    "Location Not Added"}
                </span>
              </div>

              <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">
                {user?.bio ||
                  "No bio added yet. Update your profile to tell others about yourself."}
              </p>

              {/* Social Links */}
              <div className="flex gap-3 mt-5 flex-wrap">

                {user?.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                  >
                    <FaGithub />
                  </a>
                )}

                {user?.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                  >
                    <FaLinkedin />
                  </a>
                )}

                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <FaEnvelope />
                </div>

              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full shadow-sm">

            <div className="grid grid-cols-2 gap-6">

              <div className="flex gap-4 items-start">
                <FaFolderOpen className="text-violet-600 text-3xl mt-1" />

                <div>
                  <h3 className="text-3xl font-bold">
                    {user?.projects?.length ||
                      user?.projectsCount ||
                      0}
                  </h3>

                  <p className="text-gray-500">
                    Projects
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <FaUsers className="text-violet-600 text-3xl mt-1" />

                <div>
                  <h3 className="text-3xl font-bold">
                    {user?.teamMembersCount || 0}
                  </h3>

                  <p className="text-gray-500">
                    Team Members
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200 px-6 md:px-8">
        <div className="flex gap-10 text-sm font-medium overflow-x-auto">
          <button className="py-4 border-b-2 border-violet-600 text-violet-600 whitespace-nowrap">
            Overview
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;