import {
  FaThLarge,
  FaUser,
  FaFolder,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
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
  path: "/requests",
  icon: <FaUserPlus />,
  },
  {
    title: "Logout",
    icon: <FiLogOut />,
    path: "/logout",
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          md:hidden
          fixed
          top-4
          left-4
          z-[100]
          bg-white
          p-3
          rounded-xl
          shadow-md
        "
      >
        <FaBars size={20} />
      </button>

      {/* Mobile Overlay */}
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

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0
          w-64
          bg-white
          min-h-screen
          flex flex-col
          shadow-sm
          z-[95]
          transform transition-transform duration-300

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >
        {/* Mobile Close */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Logo */}
        <div className="px-4 lg:px-6 pb-4">
          <h1 className="text-2xl lg:text-3xl font-bold">
            <span className="text-gray-900">
              TeamForge
            </span>{" "}
            <span className="text-violet-600">
              AI
            </span>
          </h1>
        </div>

        {/* Menu */}
        <div className="px-4 flex-1 overflow-y-auto">
          {menuItems.map((item, index) =>
            item.title === "Logout" ? (
              <button
                key={index}
                onClick={handleLogout}
                className="
                  flex items-center gap-4
                  p-4 rounded-xl mb-2
                  w-full text-left
                  hover:bg-red-50
                  text-red-600
                  transition
                "
              >
                {item.icon}
                <span>{item.title}</span>
              </button>
            ) : (
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
                      : "hover:bg-violet-50 text-gray-700"
                  }`
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            )
          )}
        </div>

        {/* Bottom Card */}
        <div className="m-4 bg-violet-50 rounded-2xl p-4 hidden lg:block">
          <img
            src="/team-illustration.png"
            alt="Team"
            className="w-full"
          />

          <h3 className="font-bold text-lg xl:text-xl mt-4 text-center">
            Build Great Things Together
          </h3>

          <p className="text-gray-500 text-center mt-2 text-sm">
            Connect, collaborate and create amazing
            projects.
          </p>

          <button
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