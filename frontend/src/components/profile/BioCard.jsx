import { FaUserEdit } from "react-icons/fa";

function BioCard({ bio, skills = [] }) {
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-violet-600 text-xl">
            📝
          </span>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bio
          </h2>
        </div>

        <button className="text-violet-600 hover:text-violet-700 transition">
          <FaUserEdit />
        </button>
      </div>

      {/* Bio Content */}
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

      {/* Skills */}
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
  );
}

export default BioCard;