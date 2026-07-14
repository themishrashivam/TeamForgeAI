import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCommentDots,
  FaSearch,
} from "react-icons/fa";
import api from "../services/api";

function Topbar({ user }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [results, setResults] = useState({
    users: [],
    projects: [],
  });

  const [notifications, setNotifications] =
    useState([]);

  const [showNotifications,
    setShowNotifications] =
    useState(false);

  // ==========================
  // Search
  // ==========================

  const handleSearch = async (e) => {
    const value = e.target.value;

    setQuery(value);

    if (!value.trim()) {
      setResults({
        users: [],
        projects: [],
      });

      return;
    }

    try {
      const res = await api.get(
        `/search?q=${value}`
      );

      setResults({
        users: Array.isArray(
          res.data.users
        )
          ? res.data.users
          : [],

        projects: Array.isArray(
          res.data.projects
        )
          ? res.data.projects
          : [],
      });
    } catch (error) {
      console.error(
        "Search Error:",
        error
      );

      setResults({
        users: [],
        projects: [],
      });
    }
  };

  const clearResults = () => {
    setQuery("");

    setResults({
      users: [],
      projects: [],
    });
  };

  // ==========================
  // Notifications
  // ==========================

  const fetchNotifications =
    async () => {
      try {
        const res =
          await api.get(
            "/notifications"
          );

        setNotifications(
          res.data.notifications || []
        );
      } catch (error) {
        console.log(
          "Notification Error:",
          error
        );
      }
    };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown on outside click

  useEffect(() => {
    const closeDropdown = () =>
      setShowNotifications(false);

    window.addEventListener(
      "click",
      closeDropdown
    );

    return () =>
      window.removeEventListener(
        "click",
        closeDropdown
      );
  }, []);

  const markAsRead = async (
    notificationId
  ) => {
    try {
      await api.put(
        `/notifications/${notificationId}`
      );

      setNotifications((prev) =>
        prev.filter(
          (item) =>
            item._id !== notificationId
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="
        bg-white
        px-4 md:px-8
        py-4 md:py-5
        flex
        flex-col
        lg:flex-row
        gap-4
        justify-between
        lg:items-center
      "
    >
      {/* ================= SEARCH ================= */}

      <div className="relative w-full lg:w-auto">
        <FaSearch className="absolute left-4 top-4 text-gray-400" />

        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search projects, skills or people..."
          className="
            w-full
            lg:w-[500px]
            pl-12
            py-3
            border
            rounded-xl
            outline-none
            focus:ring-2
            focus:ring-violet-500
          "
        />

        {(results?.users?.length > 0 ||
          results?.projects?.length >
            0) && (
          <div className="absolute top-14 left-0 w-full bg-white border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
            {/* USERS */}

            {results.users.length > 0 && (
              <>
                <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500">
                  USERS
                </div>

                {results.users.map(
                  (item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        clearResults();

                        navigate(
                          `/profile/${item._id}`
                        );
                      }}
                    >
                      <img
                        src={
                          item.profileImage ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div>
                        <p className="font-medium">
                          {item.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {item.branch ||
                            "Student"}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </>
            )}

            {/* PROJECTS */}

            {results.projects.length >
              0 && (
              <>
                <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 border-t">
                  PROJECTS
                </div>

                {results.projects.map(
                  (project) => (
                    <div
                      key={project._id}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        clearResults();

                        navigate(
                          `/project/${project._id}`
                        );
                      }}
                    >
                      <p className="font-medium">
                        📁 {project.title}
                      </p>

                      <p className="text-xs text-gray-500 truncate">
                        {
                          project.description
                        }
                      </p>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ================= RIGHT SECTION ================= */}

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-4
          w-full
          lg:w-auto
        "
      >
        {/* NOTIFICATIONS */}

        <div
          className="relative cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();

            setShowNotifications(
              !showNotifications
            );
          }}
        >
          <FaBell size={22} />

          {notifications.length >
            0 && (
            <span className="absolute -top-2 -right-2 bg-violet-600 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          )}

          {showNotifications && (
            <div
              className="
                absolute
                right-0
                top-10
                w-[320px]
                sm:w-96
                bg-white
                border
                rounded-xl
                shadow-xl
                z-50
                overflow-hidden
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="p-3 border-b font-semibold bg-gray-50">
                Notifications
              </div>

              {notifications.length ===
              0 ? (
                <div className="p-4 text-gray-500">
                  No Notifications
                </div>
              ) : (
                notifications.map(
                  (
                    notification
                  ) => (
                    <div
                      key={
                        notification._id
                      }
                      className="p-4 border-b hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h4 className="font-medium text-sm">
                            {
                              notification.title
                            }
                          </h4>

                          <p className="text-xs text-gray-500 mt-1">
                            {
                              notification.message
                            }
                          </p>
                        </div>

                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              markAsRead(
                                notification._id
                              )
                            }
                            className="text-xs text-violet-600 hover:text-violet-800"
                          >
                            Read
                          </button>
                        )}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          )}
        </div>

        {/* MESSAGES */}

        <div className="relative cursor-pointer">
          <FaCommentDots size={22} />

          <span className="absolute -top-2 -right-2 bg-violet-600 text-white text-xs rounded-full px-1">
            0
          </span>
        </div>

        {/* USER */}

        <div className="flex items-center gap-3 min-w-0">
          <img
            src={
              user?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-violet-200"
          />

          <div className="min-w-0">
            <h4 className="font-semibold text-gray-800 truncate">
              {user?.name || "User"}
            </h4>

            <p className="text-sm text-gray-500 truncate">
              {user?.year ||
                "Student"}
              {user?.branch
                ? `, ${user.branch}`
                : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;