import { FaCheck, FaTimes } from "react-icons/fa";

function TeamInvitesSection({
  invites = [],
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Team Invites
        </h2>

        <button className="text-violet-600">
          See all
        </button>
      </div>

      {invites.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No Pending Invites
        </div>
      ) : (
        <div className="space-y-6">

          {invites.map((invite) => (
            <div
              key={invite._id}
              className="flex justify-between items-center"
            >

              <div className="flex gap-4">

                <img
                  src={
                    invite.sender?.profileImage ||
                    "https://i.pravatar.cc/50"
                  }
                  alt=""
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>

                  <h3 className="font-semibold">
                    {invite.sender?.name}
                  </h3>

                  <p className="text-gray-500">
                    Wants to join
                  </p>

                  <p className="text-gray-500 text-sm">
                    {invite.project?.title}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <button
                  className="
                    w-10 h-10 rounded-xl
                    bg-green-100 text-green-600
                    flex items-center justify-center
                  "
                >
                  <FaCheck />
                </button>

                <button
                  className="
                    w-10 h-10 rounded-xl
                    bg-red-100 text-red-600
                    flex items-center justify-center
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