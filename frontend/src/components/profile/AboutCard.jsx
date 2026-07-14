import {
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPen,
} from "react-icons/fa";

function AboutCard({ user }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-3">
          <FaGraduationCap className="text-violet-600 text-lg" />

          <h2 className="text-2xl font-bold text-gray-900">
            About Me
          </h2>
        </div>

        <button className="text-violet-600 hover:text-violet-700">
          <FaPen />
        </button>

      </div>

      {/* Description */}

      <p className="text-gray-600 leading-8 text-sm">
        {user?.bio || "No bio added yet."}
      </p>

      {/* Details */}

      <div className="mt-8 space-y-5">

        <div className="flex items-center gap-4">
          <FaEnvelope className="text-gray-500" />

          <span className="font-medium text-gray-700 w-20">
            Email
          </span>

          <span className="text-gray-500">
            {user?.email || "Not Added"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <FaPhone className="text-gray-500" />

          <span className="font-medium text-gray-700 w-20">
            Phone
          </span>

          <span className="text-gray-500">
            {user?.phone || "Not Added"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <FaUniversity className="text-gray-500" />

          <span className="font-medium text-gray-700 w-20">
            College
          </span>

          <span className="text-gray-500">
            {user?.college || "Not Added"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <FaGraduationCap className="text-gray-500" />

          <span className="font-medium text-gray-700 w-20">
            Branch
          </span>

          <span className="text-gray-500">
            {user?.branch || "Not Added"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <FaMapMarkerAlt className="text-gray-500" />

          <span className="font-medium text-gray-700 w-20">
            Location
          </span>

          <span className="text-gray-500">
            {user?.location || "Not Added"}
          </span>
        </div>

      </div>

    </div>
  );
}

export default AboutCard;