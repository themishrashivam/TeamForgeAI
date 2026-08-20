import {
  FaThLarge,
  FaUser,
  FaFolder,
  FaSearch,
  FaBars,
  FaTimes,
  FaUserPlus,
  FaComments,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const menuItems = [
  {
    title: "Dashboard",
    icon: <FaThLarge />,
    path: "/dashboard",
  },
  {
    title: "My Profile",
    icon: <FaUser />,
    path: "/profile",
  },
  {
    title: "My Projects",
    icon: <FaFolder />,
    path: "/projects",
  },
  {
    title: "Explore Projects",
    icon: <FaSearch />,
    path: "/explore",
  },
  {
    title: "Join Requests",
    icon: <FaUserPlus />,
    path: "/requests",
  },
  {
    title: "Messages",
    icon: <FaComments />,
    path: "/messages",
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get(
        "/messages/unread-count"
      );

      setUnreadCount(
        Number(res.data.count) || 0
      );
    } catch (error) {
      console.log(
        "Unread Message Count Error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleMessagesClick = () => {
    setUnreadCount(0);
    setIsOpen(false);
    navigate("/messages");
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="
          md:hidden
          fixed
          top-4
          left-4
          z-[100]
          bg-white
          dark:bg-gray-800
          text-black
          dark:text-white
          p-3
          rounded-xl
          shadow-md
        "
      >
        <FaBars size={20} />
      </button>

      {isOpen && (
        <div
          className="
            md:hidden
            fixed
            inset-0
            bg-black/40
            z-[90]
          "
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          fixed
          left-0
          top-0
          w-64
          bg-white
          dark:bg-gray-800
          text-black
          dark:text-white
          min-h-screen
          flex
          flex-col
          shadow-sm
          z-[95]
          transform
          transition-transform
          duration-300
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          md:translate-x-0
        `}
      >
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
          >
            <FaTimes size={22} />
          </button>
        </div>

        <div className="px-4 lg:px-6 pb-4">
          <h1 className="text-2xl lg:text-3xl font-bold">
            <span className="text-gray-900 dark:text-white">
              TeamForge
            </span>{" "}
            <span className="text-violet-600">
              AI
            </span>
          </h1>
        </div>

        <div className="px-4 flex-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            if (item.title === "Messages") {
              return (
                <button
                  key={index}
                  onClick={handleMessagesClick}
                  className="
                    flex
                    items-center
                    gap-4
                    p-4
                    rounded-xl
                    mb-2
                    w-full
                    text-left
                    transition
                    hover:bg-violet-50
                    dark:hover:bg-gray-700
                    text-gray-700
                    dark:text-gray-200
                  "
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>

                  <span className="flex-1">
                    {item.title}
                  </span>

                  {unreadCount > 0 && (
                    <span
                      className="
                        min-w-[22px]
                        h-[22px]
                        px-1.5
                        rounded-full
                        bg-violet-600
                        text-white
                        text-xs
                        font-bold
                        flex
                        items-center
                        justify-center
                      "
                    >
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <NavLink
                key={index}
                to={item.path}
                onClick={() =>
                  setIsOpen(false)
                }
                className={({ isActive }) =>
                  `flex items-center gap-4 p-4 rounded-xl mb-2 transition ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-md"
                      : "hover:bg-violet-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }`
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            );
          })}

          <button
            onClick={handleLogout}
            className="
              flex
              items-center
              gap-4
              p-4
              rounded-xl
              mb-2
              w-full
              text-left
              hover:bg-red-50
              dark:hover:bg-red-900/20
              text-red-600
              transition
            "
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>

        <div
          className="
            m-4
            bg-violet-50
            dark:bg-gray-700
            rounded-2xl
            p-4
            hidden
            lg:block
          "
        >
          <img
            src="/team-illustration.png"
            alt="Team"
            className="w-full"
          />

          <h3 className="font-bold text-lg xl:text-xl mt-4 text-center text-gray-900 dark:text-white">
            Build Great Things Together
          </h3>

          <p className="text-gray-500 text-center mt-2 text-sm">
            Connect, collaborate and create amazing
            projects.
          </p>

          <button
            onClick={() =>
              navigate("/explore")
            }
            className="
              w-full
              bg-violet-600
              text-white
              py-3
              rounded-xl
              mt-4
              hover:bg-violet-700
              transition
            "
          >
            Explore Projects
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;