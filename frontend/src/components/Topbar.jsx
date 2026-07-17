import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCommentDots, FaSearch, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

function Topbar({ user }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const { darkMode, setDarkMode } = useTheme();

  const [results, setResults] = useState({
    users: [],
    projects: [],
  });

  const [notifications, setNotifications] = useState([]);

  const [showNotifications, setShowNotifications] = useState(false);

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
      const res = await api.get(`/search?q=${value}`);

      setResults({
        users: Array.isArray(res.data.users) ? res.data.users : [],

        projects: Array.isArray(res.data.projects) ? res.data.projects : [],
      });
    } catch (error) {
      console.error("Search Error:", error);

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

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");

      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.log("Notification Error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown on outside click

  useEffect(() => {
    const closeDropdown = () => setShowNotifications(false);

    window.addEventListener("click", closeDropdown);

    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}`);

      setNotifications((prev) =>
        prev.filter((item) => item._id !== notificationId),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="
          bg-white
          dark:bg-gray-800
          px-4 md:px-8
          py-4 md:py-5
          flex
          flex-col
          lg:flex-row
          gap-4
          justify-between
          lg:items-center
          text-black
          dark:text-white
          border-b
          dark:border-gray-700
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

              bg-white
              dark:bg-slate-800

              text-gray-900
              dark:text-white

              border
              border-gray-300
              dark:border-slate-600

              rounded-xl

              outline-none
              focus:ring-2
              focus:ring-violet-500
              "
        />

        {(results?.users?.length > 0 || results?.projects?.length > 0) && (
          <div
                className="
                absolute
                top-16
                left-0
                w-full

                bg-white
                dark:bg-slate-800

                border
                border-gray-200
                dark:border-slate-700

                rounded-xl
                shadow-xl

                z-50
                max-h-[450px]
                overflow-y-auto
                "
                >
            {/* USERS */}

            {results.users.length > 0 && (
              <>
                <div className="px-4 py-2 bg-gray-50
dark:bg-slate-700 text-xs font-semibold text-gray-500
dark:text-gray-300">
                  USERS
                </div>

               {results.users.map((item) => (
                  <div
                    key={item._id}
                    className="
                      flex
                      items-center
                      gap-3
                      p-3
                      cursor-pointer
                      hover:bg-gray-100
                      dark:hover:bg-gray-700
                      transition
                    "
                    onClick={() => {
                      clearResults();
                      navigate(`/profile/${item._id}`);
                    }}
                  >
                    <img
                      src={
                        item.profileImage ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt={item.name}
                      className="
                        w-12
                        h-12
                        rounded-full
                        object-cover
                        shrink-0
                      "
                    />

                    <div className="min-w-0">
                      <h4
                        className="
                          font-semibold
                          text-gray-900
                          dark:text-white
                          truncate
                        "
                      >
                        {item.name}
                      </h4>

                      <p
                        className="
                          text-sm
                          text-gray-500
dark:text-gray-300
                          dark:text-gray-300
                        "
                      >
                        {item.branch || "Student"}
                      </p>
                    </div>
                  </div>
                ))}

               </>
            )}  

            {/* PROJECTS */}

            {results.projects.length > 0 && (
              <>
                <div className="px-4 py-2 bg-gray-50
dark:bg-slate-700 text-xs font-semibold text-gray-500
dark:text-gray-300 border-t">
                  PROJECTS
                </div>

                {results.projects.map((project) => (
                  <div
                    key={project._id}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      clearResults();

                      navigate(`/project/${project._id}`);
                    }}
                  >
                    <p className="font-medium">📁 {project.title}</p>

                    <p className="text-xs text-gray-500
dark:text-gray-300 truncate">
                      {project.description}
                    </p>
                  </div>
                ))}
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

            setShowNotifications(!showNotifications);
          }}
        >
          <FaBell size={22} />

          {notifications.length > 0 && (
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
                dark:bg-gray-800
                border
                dark:border-gray-700
                rounded-xl
                shadow-xl
                z-50
                overflow-hidden
              "

              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 border-b font-semibold bg-gray-50
dark:bg-slate-700">
                Notifications
              </div>

              {notifications.length === 0 ? (
                <div className="p-4 text-gray-500
dark:text-gray-300">No Notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="p-4 border-b hover:bg-gray-50
dark:bg-slate-700"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>

                        <p className="text-xs text-gray-500
dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="text-xs text-violet-600 hover:text-violet-800"
                        >
                          Read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {/* THEME TOGGLE */}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="
            p-2
            rounded-lg
            bg-gray-200
            dark:bg-gray-700
            hover:scale-105
            transition
          "
        >
          {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>
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
            <h4 className="font-semibold text-gray-800 dark:text-white truncate">
              {user?.name || "User"}
            </h4>

            <p className="text-sm text-gray-500
dark:text-gray-300 dark:text-gray-300 truncate">
              {user?.year || "Student"}
              {user?.branch ? `, ${user.branch}` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
