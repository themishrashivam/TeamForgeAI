import { useState } from "react";
import {
  FaCode,
  FaUsers,
  FaStar,
  FaShieldAlt,
  FaPen,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

function BadgesCard({ user, onUpdate, saving = false }) {
  const [showEdit, setShowEdit] = useState(false);

  const defaultBadges = [
    {
      id: "teamforge-member",
      title: "TeamForge Member",
      icon: <FaUsers />,
      color: "from-purple-600 to-fuchsia-500",
      enabled: true,
    },
    {
      id: "problem-solver",
      title: "Problem Solver",
      icon: <FaStar />,
      color: "from-amber-500 to-orange-500",
      enabled: true,
    },
  ];

  if (user?.skills?.length >= 3) {
    defaultBadges.unshift({
      id: "skilled-developer",
      title: "Skilled Developer",
      icon: <FaCode />,
      color: "from-violet-600 to-purple-500",
      enabled: true,
    });
  }

  const [badges, setBadges] = useState(defaultBadges);

  const openEdit = () => {
    setBadges(defaultBadges);
    setShowEdit(true);
  };

  const toggleBadge = (id) => {
    setBadges((prev) =>
      prev.map((badge) =>
        badge.id === id
          ? {
              ...badge,
              enabled: !badge.enabled,
            }
          : badge
      )
    );
  };

  const handleSave = async () => {
    if (!onUpdate) {
      setShowEdit(false);
      return;
    }

    const enabledBadges = badges
      .filter((badge) => badge.enabled)
      .map((badge) => badge.id);

    const result = await onUpdate({
      badges: enabledBadges,
    });

    if (result?.success) {
      setShowEdit(false);
    }
  };

  const visibleBadges = badges.filter(
    (badge) => badge.enabled
  );

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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-violet-600 text-lg" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Badges
            </h2>
          </div>

          <button
            type="button"
            onClick={openEdit}
            className="
              p-2
              rounded-lg
              text-violet-600
              hover:text-violet-700
              hover:bg-violet-50
              dark:hover:bg-violet-900/20
              transition
            "
            title="Edit Badges"
          >
            <FaPen />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleBadges.length > 0 ? (
            visibleBadges.map((badge) => (
              <div
                key={badge.id}
                className="
                  flex
                  flex-col
                  items-center
                  text-center
                  p-4
                  rounded-2xl
                  hover:bg-gray-50
                  dark:hover:bg-slate-700
                  transition
                "
              >
                <div
                  className={`
                    w-24
                    h-24
                    rounded-full
                    bg-gradient-to-br
                    ${badge.color}
                    flex
                    items-center
                    justify-center
                    text-white
                    text-4xl
                    shadow-lg
                  `}
                >
                  {badge.icon}
                </div>

                <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">
                  {badge.title}
                </h3>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <FaShieldAlt className="mx-auto text-4xl text-gray-300 dark:text-gray-600" />

              <p className="mt-3 text-gray-500 dark:text-gray-400">
                No badges enabled
              </p>
            </div>
          )}
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div
            className="
              w-full
              max-w-lg
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
                  Manage Badges
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Choose which badges appear on your profile.
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

            <div className="p-5 space-y-3">
              {badges.map((badge) => (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() =>
                    toggleBadge(badge.id)
                  }
                  className={`
                    w-full
                    flex
                    items-center
                    gap-4
                    p-4
                    rounded-xl
                    border
                    transition
                    text-left
                    ${
                      badge.enabled
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                        : "border-gray-200 dark:border-slate-700 hover:border-violet-400"
                    }
                  `}
                >
                  <div
                    className={`
                      w-12
                      h-12
                      rounded-full
                      bg-gradient-to-br
                      ${badge.color}
                      flex
                      items-center
                      justify-center
                      text-white
                      text-xl
                      flex-shrink-0
                    `}
                  >
                    {badge.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {badge.title}
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {badge.enabled
                        ? "Visible on profile"
                        : "Hidden from profile"}
                    </p>
                  </div>

                  <div
                    className={`
                      w-7
                      h-7
                      rounded-full
                      flex
                      items-center
                      justify-center
                      ${
                        badge.enabled
                          ? "bg-violet-600 text-white"
                          : "border border-gray-300 dark:border-slate-600"
                      }
                    `}
                  >
                    {badge.enabled && <FaCheck size={12} />}
                  </div>
                </button>
              ))}
            </div>

            <div
              className="
                flex
                justify-end
                gap-3
                p-5
                border-t
                border-gray-200
                dark:border-slate-700
              "
            >
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
                type="button"
                onClick={handleSave}
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
          </div>
        </div>
      )}
    </>
  );
}

export default BadgesCard;