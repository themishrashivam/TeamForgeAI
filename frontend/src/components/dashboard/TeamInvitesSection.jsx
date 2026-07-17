import { FaCheck, FaTimes } from "react-icons/fa";

function TeamInvitesSection({ invites = [] }) {
  return (
    <div
      className="
        bg-white
        dark:bg-slate-800
        rounded-3xl
        p-6
        shadow-sm
        border
        border-gray-200
        dark:border-slate-700
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Team Invites
        </h2>

        <button className="text-violet-600 hover:text-violet-700 font-medium">
          See all
        </button>
      </div>

      {/* Content */}
      {invites.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-300">
          No Pending Invites
        </div>
      ) : (
        <div className="space-y-4">
          {invites.map((invite) => (
            <div
              key={invite._id}
              className="
                flex
                flex-col
                sm:flex-row
                justify-between
                sm:items-center
                gap-4
                p-4
                rounded-2xl
                border
                border-gray-200
                dark:border-slate-700
                hover:shadow-lg
                transition
              "
            >
              {/* User Info */}
              <div className="flex gap-4 items-center">
                <img
                  src={
                    invite.sender?.profileImage ||
                    "https://i.pravatar.cc/50"
                  }
                  alt=""
                  className="
                    w-14
                    h-14
                    rounded-full
                    object-cover
                    border-2
                    border-violet-200
                  "
                />

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {invite.sender?.name}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-300">
                    Wants to join
                  </p>

                  <p className="text-sm text-violet-600">
                    {invite.project?.title}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-green-100
                    text-green-600
                    flex
                    items-center
                    justify-center
                    hover:bg-green-200
                    transition
                  "
                >
                  <FaCheck />
                </button>

                <button
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-red-100
                    text-red-600
                    flex
                    items-center
                    justify-center
                    hover:bg-red-200
                    transition
                  "
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeamInvitesSection;