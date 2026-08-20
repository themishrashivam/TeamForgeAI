import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCommentDots,
  FaSearch,
  FaMoon,
  FaSun,
  FaUserCircle,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

function Topbar({ user }) {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

  const [query, setQuery] = useState("");

  const [results, setResults] = useState({
    users: [],
    projects: [],
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] =
    useState(false);

  const [messageCount, setMessageCount] = useState(0);
  const [messageConversations, setMessageConversations] =
    useState([]);
  const [showMessages, setShowMessages] =
    useState(false);

  const [messageLoading, setMessageLoading] =
    useState(false);

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
        `/search?q=${encodeURIComponent(value)}`
      );

      setResults({
        users: Array.isArray(res.data.users)
          ? res.data.users
          : [],
        projects: Array.isArray(res.data.projects)
          ? res.data.projects
          : [],
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

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");

      setNotifications(
        Array.isArray(res.data.notifications)
          ? res.data.notifications
          : []
      );
    } catch (error) {
      console.error(
        "Notification Fetch Error:",
        error.response?.data || error.message
      );

      setNotifications([]);
    }
  };

  const fetchMessageCount = async () => {
    try {
      const res = await api.get(
        "/messages/unread-count"
      );

      setMessageCount(
        Number(res.data.count) || 0
      );
    } catch (error) {
      console.error(
        "Message Count Error:",
        error.response?.data || error.message
      );

      setMessageCount(0);
    }
  };

  const fetchMessageConversations = async () => {
    try {
      setMessageLoading(true);

      const res = await api.get(
        "/messages/conversations"
      );

      const conversations = Array.isArray(
        res.data.conversations
      )
        ? res.data.conversations
        : [];

      setMessageConversations(conversations);

      const totalUnread = conversations.reduce(
        (total, conversation) =>
          total +
          (Number(conversation.unreadCount) || 0),
        0
      );

      setMessageCount(totalUnread);
    } catch (error) {
      console.error(
        "Message Conversations Error:",
        error.response?.data || error.message
      );

      setMessageConversations([]);
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchMessageCount();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessageCount();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => {
      setShowNotifications(false);
      setShowMessages(false);
    };

    window.addEventListener(
      "click",
      handleOutsideClick
    );

    return () => {
      window.removeEventListener(
        "click",
        handleOutsideClick
      );
    };
  }, []);

  const handleNotificationClick = (e) => {
    e.stopPropagation();

    setShowNotifications((prev) => !prev);
    setShowMessages(false);

    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const handleMessageClick = (e) => {
    e.stopPropagation();

    setShowMessages((prev) => !prev);
    setShowNotifications(false);

    if (!showMessages) {
      fetchMessageConversations();
    }
  };

  const handleConversationClick = (
    conversation
  ) => {
    if (
      !conversation?.project?._id ||
      !conversation?.user?._id
    ) {
      navigate("/messages");
      return;
    }

    setShowMessages(false);

    navigate(
      `/messages?project=${conversation.project._id}&user=${conversation.user._id}`
    );
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(
        `/notifications/${notificationId}`
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Mark Notification Error:",
        error.response?.data || error.message
      );
    }
  };

  const unreadNotificationCount =
    notifications.filter(
      (notification) =>
        notification.isRead !== true
    ).length;

  const unreadConversations =
    messageConversations.filter(
      (conversation) =>
        Number(conversation.unreadCount) > 0
    );

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

        {(results.users.length > 0 ||
          results.projects.length > 0) && (
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
            {results.users.length > 0 && (
              <>
                <div
                  className="
                    px-4
                    py-2
                    bg-gray-50
                    dark:bg-slate-700
                    text-xs
                    font-semibold
                    text-gray-500
                    dark:text-gray-300
                  "
                >
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

                      navigate(
                        `/profile/${item._id}`
                      );
                    }}
                  >
                    {item.profileImage ? (
                      <img
                        src={item.profileImage}
                        alt={item.name}
                        className="
                          w-12
                          h-12
                          rounded-full
                          object-cover
                          shrink-0
                        "
                      />
                    ) : (
                      <FaUserCircle className="text-5xl text-violet-500" />
                    )}

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
                        "
                      >
                        {item.branch || "Student"}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {results.projects.length > 0 && (
              <>
                <div
                  className="
                    px-4
                    py-2
                    bg-gray-50
                    dark:bg-slate-700
                    text-xs
                    font-semibold
                    text-gray-500
                    dark:text-gray-300
                    border-t
                  "
                >
                  PROJECTS
                </div>

                {results.projects.map((project) => (
                  <div
                    key={project._id}
                    className="
                      p-3
                      hover:bg-gray-100
                      dark:hover:bg-gray-700
                      cursor-pointer
                    "
                    onClick={() => {
                      clearResults();

                      navigate(
                        `/project/${project._id}`
                      );
                    }}
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      📁 {project.title}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                      {project.description}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

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
        <div className="relative">
          <button
            type="button"
            onClick={handleNotificationClick}
            className="
              relative
              cursor-pointer
              p-2
              rounded-lg
              hover:bg-gray-100
              dark:hover:bg-gray-700
              transition
            "
          >
            <FaBell size={22} />

            {unreadNotificationCount > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  bg-violet-600
                  text-white
                  text-xs
                  font-bold
                  rounded-full
                  min-w-[20px]
                  h-[20px]
                  px-1
                  flex
                  items-center
                  justify-center
                "
              >
                {unreadNotificationCount > 99
                  ? "99+"
                  : unreadNotificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="
                absolute
                right-0
                top-12
                w-[320px]
                sm:w-96
                bg-white
                dark:bg-gray-800
                border
                border-gray-200
                dark:border-gray-700
                rounded-xl
                shadow-xl
                z-[100]
                overflow-hidden
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div
                className="
                  px-4
                  py-3
                  border-b
                  border-gray-200
                  dark:border-gray-700
                  font-semibold
                  bg-gray-50
                  dark:bg-slate-700
                  flex
                  items-center
                  justify-between
                "
              >
                <span>
                  Notifications
                </span>

                {unreadNotificationCount >
                  0 && (
                  <span className="text-xs text-violet-600 dark:text-violet-400">
                    {unreadNotificationCount} unread
                  </span>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-300">
                  <FaBell className="mx-auto text-3xl mb-3 text-gray-300 dark:text-gray-600" />

                  <p>
                    No Notifications
                  </p>
                </div>
              ) : (
                <div className="max-h-[420px] overflow-y-auto">
                  {notifications.map(
                    (notification) => (
                      <div
                        key={
                          notification._id
                        }
                        className={`
                          p-4
                          border-b
                          border-gray-200
                          dark:border-gray-700
                          transition
                          ${
                            notification.isRead !==
                            true
                              ? "bg-violet-50 dark:bg-violet-900/20"
                              : "bg-white dark:bg-gray-800"
                          }
                        `}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`
                              w-9
                              h-9
                              rounded-full
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                              ${
                                notification.isRead !==
                                true
                                  ? "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300"
                                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                              }
                            `}
                          >
                            <FaBell />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4
                                className={`
                                  text-sm
                                  ${
                                    notification.isRead !==
                                    true
                                      ? "font-bold text-gray-900 dark:text-white"
                                      : "font-medium text-gray-700 dark:text-gray-200"
                                  }
                                `}
                              >
                                {
                                  notification.title
                                }
                              </h4>

                              {notification.isRead !==
                                true && (
                                <span className="w-2 h-2 bg-violet-600 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                              {
                                notification.message
                              }
                            </p>

                            {notification.createdAt && (
                              <p className="text-[11px] text-gray-400 mt-2">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleString()}
                              </p>
                            )}

                            {notification.isRead !==
                              true && (
                              <button
                                type="button"
                                onClick={() =>
                                  markAsRead(
                                    notification._id
                                  )
                                }
                                className="
                                  mt-2
                                  text-xs
                                  font-medium
                                  text-violet-600
                                  dark:text-violet-400
                                  hover:text-violet-800
                                  dark:hover:text-violet-300
                                "
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={handleMessageClick}
            className="
              relative
              cursor-pointer
              p-2
              rounded-lg
              hover:bg-gray-100
              dark:hover:bg-gray-700
              transition
            "
          >
            <FaCommentDots size={22} />

            {messageCount > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  bg-violet-600
                  text-white
                  text-xs
                  font-bold
                  rounded-full
                  min-w-[20px]
                  h-[20px]
                  px-1
                  flex
                  items-center
                  justify-center
                "
              >
                {messageCount > 99
                  ? "99+"
                  : messageCount}
              </span>
            )}
          </button>

          {showMessages && (
            <div
              className="
                absolute
                right-0
                top-12
                w-[320px]
                sm:w-96
                bg-white
                dark:bg-gray-800
                border
                border-gray-200
                dark:border-gray-700
                rounded-xl
                shadow-xl
                z-[100]
                overflow-hidden
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div
                className="
                  px-4
                  py-3
                  border-b
                  border-gray-200
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-slate-700
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Messages
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                    {messageCount > 0
                      ? `${messageCount} unread message${
                          messageCount > 1
                            ? "s"
                            : ""
                        }`
                      : "No unread messages"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowMessages(false);
                    navigate("/messages");
                  }}
                  className="
                    text-xs
                    font-medium
                    text-violet-600
                    dark:text-violet-400
                    hover:text-violet-800
                  "
                >
                  View all
                </button>
              </div>

              {messageLoading ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-300">
                  Loading messages...
                </div>
              ) : unreadConversations.length ===
                0 ? (
                <div className="p-8 text-center">
                  <FaCommentDots className="mx-auto text-4xl text-gray-300 dark:text-gray-600" />

                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    No unread messages
                  </p>

                  <button
                    onClick={() => {
                      setShowMessages(false);
                      navigate("/messages");
                    }}
                    className="
                      mt-4
                      px-4
                      py-2
                      rounded-lg
                      bg-violet-600
                      hover:bg-violet-700
                      text-white
                      text-sm
                    "
                  >
                    Open Messages
                  </button>
                </div>
              ) : (
                <div className="max-h-[420px] overflow-y-auto">
                  {unreadConversations.map(
                    (conversation, index) => (
                      <button
                        key={`${conversation.project?._id}-${conversation.user?._id}-${index}`}
                        onClick={() =>
                          handleConversationClick(
                            conversation
                          )
                        }
                        className="
                          w-full
                          text-left
                          p-4
                          flex
                          gap-3
                          border-b
                          border-gray-200
                          dark:border-gray-700
                          hover:bg-violet-50
                          dark:hover:bg-slate-700
                          transition
                        "
                      >
                        {conversation.user
                          ?.profileImage ? (
                          <img
                            src={
                              conversation
                                .user
                                .profileImage
                            }
                            alt={
                              conversation
                                .user
                                .name
                            }
                            className="
                              w-11
                              h-11
                              rounded-full
                              object-cover
                              flex-shrink-0
                            "
                          />
                        ) : (
                          <FaUserCircle className="text-5xl text-violet-500 flex-shrink-0" />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                              {
                                conversation
                                  .user?.name
                              }
                            </h4>

                            <span
                              className="
                                min-w-[20px]
                                h-5
                                px-1.5
                                rounded-full
                                bg-violet-600
                                text-white
                                text-[10px]
                                font-bold
                                flex
                                items-center
                                justify-center
                              "
                            >
                              {
                                conversation.unreadCount
                              }
                            </span>
                          </div>

                          <p className="text-xs text-violet-600 dark:text-violet-400 mt-1 truncate">
                            {
                              conversation
                                .project?.title
                            }
                          </p>

                          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 truncate">
                            {
                              conversation.lastMessage
                            }
                          </p>

                          {conversation.lastMessageTime && (
                            <p className="text-[11px] text-gray-400 mt-1">
                              {new Date(
                                conversation.lastMessageTime
                              ).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="
            p-2
            rounded-lg
            bg-gray-200
            dark:bg-gray-700
            hover:scale-105
            transition
          "
        >
          {darkMode ? (
            <FaSun size={18} />
          ) : (
            <FaMoon size={18} />
          )}
        </button>

        <div className="flex items-center gap-3 min-w-0">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="
                w-12
                h-12
                rounded-full
                object-cover
                border-2
                border-violet-200
              "
            />
          ) : (
            <FaUserCircle className="text-5xl text-violet-500" />
          )}

          <div className="min-w-0">
            <h4
              className="
                font-semibold
                text-gray-800
                dark:text-white
                truncate
              "
            >
              {user?.name || "User"}
            </h4>

            <p
              className="
                text-sm
                text-gray-500
                dark:text-gray-300
                truncate
              "
            >
              {user?.year || "Student"}
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