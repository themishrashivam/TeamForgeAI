import { FaUserEdit } from "react-icons/fa";

function BioCard({ bio, skills = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-3">
          <span className="text-violet-600 text-xl">
            📝
          </span>

          <h2 className="text-2xl font-bold text-gray-900">
            Bio
          </h2>
        </div>

        <button className="text-violet-600 hover:text-violet-700">
          <FaUserEdit />
        </button>

      </div>

      {/* Bio Content */}
      <div className="space-y-4">

        <p className="text-gray-700 leading-7">
          {bio?.trim()
            ? bio
            : "No bio added yet. Update your profile to tell others about yourself."}
        </p>

      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-3 mt-8">

        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-sm">
            No skills added yet
          </span>
        )}

      </div>

    </div>
  );
}

export default BioCard;