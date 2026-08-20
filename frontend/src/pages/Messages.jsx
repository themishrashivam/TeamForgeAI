import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaSearch,
  FaUserCircle,
  FaPlus,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

function Message() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const [user, setUser] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [showNewMessage, setShowNewMessage] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberResults, setMemberResults] = useState([]);
  const [memberLoading, setMemberLoading] = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const projectIdFromUrl = searchParams.get("project");
  const userIdFromUrl = searchParams.get("user");

  const getId = (value) => {
    if (!value) return null;

    if (typeof value === "object") {
      return value._id?.toString() || null;
    }

    return value.toString();
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");

      setUser(res.data.user);
    } catch (error) {
      console.log("Profile Error:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/messages/conversations");

      const data = Array.isArray(res.data.conversations)
        ? res.data.conversations
        : [];

      setConversations(data);

      if (projectIdFromUrl && userIdFromUrl) {
        const conversation = data.find(
          (item) =>
            getId(item.project) === projectIdFromUrl &&
            getId(item.user) === userIdFromUrl
        );

        if (conversation) {
          setSelectedConversation(conversation);
        }
      }
    } catch (error) {
      console.log("Conversation Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load conversations."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (projectId, userId) => {
    if (!projectId || !userId) {
      return;
    }

    try {
      setMessageLoading(true);
      setError("");

      const res = await api.get(
        `/messages/${projectId}/${userId}`
      );

      setMessages(
        Array.isArray(res.data.messages)
          ? res.data.messages
          : []
      );

      try {
        await api.put(
          `/messages/read/${projectId}/${userId}`
        );
      } catch (readError) {
        console.log("Read Message Error:", readError);
      }

      setConversations((prev) =>
        prev.map((conversation) => {
          if (
            getId(conversation.project) === projectId &&
            getId(conversation.user) === userId
          ) {
            return {
              ...conversation,
              unreadCount: 0,
            };
          }

          return conversation;
        })
      );
    } catch (error) {
      console.log("Messages Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load messages."
      );
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchConversations();
  }, []);

  useEffect(() => {
    const projectId = getId(selectedConversation?.project);
    const userId = getId(selectedConversation?.user);

    if (projectId && userId) {
      fetchMessages(projectId, userId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      "http://localhost:10000";

    const socket = io(socketUrl, {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error);
    });

    socket.on("receiveMessage", (newMessage) => {
      console.log("Real-time message:", newMessage);

      const currentProjectId = getId(
        selectedConversation?.project
      );

      const currentUserId = getId(
        selectedConversation?.user
      );

      if (!currentProjectId || !currentUserId) {
        return;
      }

      const messageProjectId =
        getId(newMessage.project) ||
        getId(newMessage.projectId);

      const senderId =
        getId(newMessage.sender);

      const receiverId =
        getId(newMessage.receiver);

      const currentUserIdString =
        user?._id?.toString();

      const isSameProject =
        messageProjectId?.toString() ===
        currentProjectId?.toString();

      const isSameConversation =
        isSameProject &&
        (
          senderId === currentUserId ||
          senderId === currentUserIdString
        ) &&
        (
          receiverId === currentUserId ||
          receiverId === currentUserIdString
        );

      if (!isSameConversation) {
        return;
      }

      setMessages((prev) => {
        const exists = prev.some(
          (item) =>
            item._id &&
            newMessage._id &&
            item._id.toString() ===
              newMessage._id.toString()
        );

        if (exists) {
          return prev;
        }

        return [...prev, newMessage];
      });

      setConversations((prev) => {
        const conversationExists = prev.some(
          (conversation) =>
            getId(conversation.project) ===
              currentProjectId &&
            getId(conversation.user) ===
              currentUserId
        );

        if (!conversationExists) {
          return prev;
        }

        return prev.map((conversation) => {
          if (
            getId(conversation.project) ===
              currentProjectId &&
            getId(conversation.user) ===
              currentUserId
          ) {
            return {
              ...conversation,
              lastMessage: newMessage.message,
              lastMessageTime:
                newMessage.createdAt ||
                new Date().toISOString(),
            };
          }

          return conversation;
        });
      });
    });

    socket.on(
      "userTyping",
      ({ senderId, receiverId }) => {
        const selectedUserId = getId(
          selectedConversation?.user
        );

        if (
          senderId?.toString() ===
            selectedUserId?.toString() &&
          receiverId?.toString() ===
            user?._id?.toString()
        ) {
          setIsTyping(true);
        }
      }
    );

    socket.on(
      "userStoppedTyping",
      ({ senderId, receiverId }) => {
        const selectedUserId = getId(
          selectedConversation?.user
        );

        if (
          senderId?.toString() ===
            selectedUserId?.toString() &&
          receiverId?.toString() ===
            user?._id?.toString()
        ) {
          setIsTyping(false);
        }
      }
    );

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");

      socket.disconnect();

      socketRef.current = null;
    };
  }, [user]);

  useEffect(() => {
    const projectId = getId(
      selectedConversation?.project
    );

    if (!socketRef.current || !projectId) {
      return;
    }

    socketRef.current.emit(
      "joinProject",
      projectId
    );

    setIsTyping(false);
  }, [selectedConversation]);

  const searchMembers = async (value) => {
    if (!value.trim()) {
      setMemberResults([]);
      return;
    }

    try {
      setMemberLoading(true);
      setError("");

      const res = await api.get(
        `/messages/members/search?q=${encodeURIComponent(
          value.trim()
        )}`
      );

      const data =
        res.data.members ||
        res.data.users ||
        res.data.data ||
        [];

      setMemberResults(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.log("Member Search Error:", error);

      setMemberResults([]);

      setError(
        error.response?.data?.message ||
          "Unable to search members."
      );
    } finally {
      setMemberLoading(false);
    }
  };

  const handleMemberSearch = (e) => {
    const value = e.target.value;

    setMemberSearch(value);
    setSelectedMember(null);
    setSelectedProject(null);

    clearTimeout(searchTimeoutRef.current);

    if (!value.trim()) {
      setMemberResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchMembers(value);
    }, 300);
  };

  const handleStartConversation = (
    member,
    project = null
  ) => {
    const memberProjects =
      member.projects ||
      member.commonProjects ||
      [];

    let projectToUse = project;

    if (!projectToUse && member.project) {
      projectToUse = member.project;
    }

    if (!projectToUse && member.projectId) {
      projectToUse = {
        _id: member.projectId,
        title:
          member.projectTitle ||
          "Project",
      };
    }

    if (
      !projectToUse &&
      memberProjects.length === 1
    ) {
      projectToUse = memberProjects[0];
    }

    if (
      !projectToUse &&
      memberProjects.length > 1
    ) {
      setSelectedMember(member);
      setSelectedProject(null);
      return;
    }

    if (!projectToUse?._id) {
      setError(
        "No common project found with this member."
      );
      return;
    }

    const conversation = {
      user: member,
      project: projectToUse,
      lastMessage: "",
      lastMessageTime: null,
      unreadCount: 0,
    };

    setConversations((prev) => {
      const exists = prev.some(
        (item) =>
          getId(item.project) ===
            getId(projectToUse) &&
          getId(item.user) ===
            getId(member)
      );

      if (exists) {
        return prev;
      }

      return [conversation, ...prev];
    });

    setSelectedConversation(conversation);
    setMessages([]);
    setIsTyping(false);

    setShowNewMessage(false);
    setMemberSearch("");
    setMemberResults([]);
    setSelectedMember(null);
    setSelectedProject(null);
    setError("");

    navigate(
      `/messages?project=${getId(
        projectToUse
      )}&user=${getId(member)}`
    );
  };

  const handleSelectConversation = (
    conversation
  ) => {
    setSelectedConversation(conversation);

    setMessages([]);
    setIsTyping(false);

    navigate(
      `/messages?project=${getId(
        conversation.project
      )}&user=${getId(conversation.user)}`
    );
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;

    setMessage(value);

    if (
      !socketRef.current ||
      !selectedConversation ||
      !user?._id
    ) {
      return;
    }

    const projectId = getId(
      selectedConversation.project
    );

    const receiverId = getId(
      selectedConversation.user
    );

    if (!projectId || !receiverId) {
      return;
    }

    socketRef.current.emit("typing", {
      projectId,
      senderId: user._id,
      receiverId,
    });

    clearTimeout(
      typingTimeoutRef.current
    );

    typingTimeoutRef.current =
      setTimeout(() => {
        socketRef.current?.emit(
          "stopTyping",
          {
            projectId,
            senderId: user._id,
            receiverId,
          }
        );
      }, 1000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    if (!selectedConversation) {
      return;
    }

    const messageText = message.trim();

    const receiverId = getId(
      selectedConversation.user
    );

    const projectId = getId(
      selectedConversation.project
    );

    if (!receiverId || !projectId) {
      setError(
        "Please select a valid member and project."
      );
      return;
    }

    try {
      setSending(true);
      setError("");

      const res = await api.post(
        "/messages/send",
        {
          receiverId,
          projectId,
          message: messageText,
        }
      );

      const savedMessage =
        res.data.data;

      if (savedMessage) {
        setMessages((prev) => {
          const exists = prev.some(
            (item) =>
              item._id &&
              savedMessage._id &&
              item._id.toString() ===
                savedMessage._id.toString()
          );

          if (exists) {
            return prev;
          }

          return [...prev, savedMessage];
        });

        socketRef.current?.emit(
          "sendMessage",
          {
            projectId,
            receiverId,
            message: savedMessage.message,
            sender:
              savedMessage.sender ||
              user,
            _id: savedMessage._id,
            createdAt:
              savedMessage.createdAt,
          }
        );
      }

      setMessage("");

      setConversations((prev) =>
        prev.map((conversation) => {
          if (
            getId(conversation.project) ===
              projectId &&
            getId(conversation.user) ===
              receiverId
          ) {
            return {
              ...conversation,
              lastMessage: messageText,
              lastMessageTime:
                new Date().toISOString(),
            };
          }

          return conversation;
        })
      );

      socketRef.current?.emit(
        "stopTyping",
        {
          projectId,
          senderId: user?._id,
          receiverId,
        }
      );

      setIsTyping(false);
    } catch (error) {
      console.log(
        "Send Message Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  };

  const filteredConversations =
    conversations.filter(
      (conversation) => {
        const name =
          conversation.user?.name?.toLowerCase() ||
          "";

        const project =
          conversation.project?.title?.toLowerCase() ||
          "";

        const value =
          search.toLowerCase();

        return (
          name.includes(value) ||
          project.includes(value)
        );
      }
    );

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const isMyMessage = (item) => {
    return (
      getId(item.sender) ===
      user?._id?.toString()
    );
  };

  const closeNewMessage = () => {
    clearTimeout(searchTimeoutRef.current);

    setShowNewMessage(false);
    setMemberSearch("");
    setMemberResults([]);
    setSelectedMember(null);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-slate-900 flex">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Topbar user={user} />

        <main className="p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Messages
              </h1>

              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Communicate with your project team members.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300">
                {error}

                <button
                  onClick={() => setError("")}
                  className="float-right font-bold"
                >
                  ×
                </button>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm h-[calc(100vh-220px)] min-h-[550px]">

              <div className="grid grid-cols-1 md:grid-cols-3 h-full">

                <div
                  className={`
                    ${
                      selectedConversation
                        ? "hidden md:flex"
                        : "flex"
                    }
                    flex-col
                    border-r
                    border-gray-200
                    dark:border-slate-700
                  `}
                >
                  <div className="p-4 border-b border-gray-200 dark:border-slate-700">

                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                        Conversations
                      </h2>

                      <button
                        onClick={() =>
                          setShowNewMessage(true)
                        }
                        className="w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition"
                        title="New Message"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <div className="relative mt-4">
                      <FaSearch className="absolute left-3 top-3 text-gray-400" />

                      <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">

                    {loading ? (
                      <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                        Loading...
                      </div>
                    ) : filteredConversations.length === 0 ? (
                      <div className="p-8 text-center">
                        <FaUserCircle className="mx-auto text-5xl text-gray-300 dark:text-gray-600" />

                        <p className="mt-4 font-medium text-gray-700 dark:text-gray-300">
                          No conversations
                        </p>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Click + to start a new conversation.
                        </p>
                      </div>
                    ) : (
                      filteredConversations.map(
                        (conversation, index) => {

                          const selected =
                            getId(
                              selectedConversation?.project
                            ) ===
                              getId(
                                conversation.project
                              ) &&
                            getId(
                              selectedConversation?.user
                            ) ===
                              getId(
                                conversation.user
                              );

                          return (
                            <div
                              key={`${getId(
                                conversation.project
                              )}-${getId(
                                conversation.user
                              )}-${index}`}
                              onClick={() =>
                                handleSelectConversation(
                                  conversation
                                )
                              }
                              className={`
                                p-4
                                flex
                                gap-3
                                cursor-pointer
                                border-b
                                border-gray-100
                                dark:border-slate-700
                                transition
                                ${
                                  selected
                                    ? "bg-violet-50 dark:bg-violet-900/20"
                                    : "hover:bg-gray-50 dark:hover:bg-slate-700"
                                }
                              `}
                            >
                              {conversation.user
                                ?.profileImage ? (
                                <img
                                  src={
                                    conversation.user
                                      .profileImage
                                  }
                                  alt={
                                    conversation.user
                                      .name
                                  }
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <FaUserCircle className="text-5xl text-violet-500" />
                              )}

                              <div className="flex-1 min-w-0">

                                <div className="flex justify-between gap-2">
                                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                    {conversation.user?.name ||
                                      "User"}
                                  </h3>

                                  {conversation.lastMessageTime && (
                                    <span className="text-xs text-gray-400">
                                      {formatTime(
                                        conversation.lastMessageTime
                                      )}
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-violet-600 dark:text-violet-400 truncate mt-1">
                                  {conversation.project?.title ||
                                    "Project"}
                                </p>

                                <div className="flex items-center justify-between gap-2 mt-1">
                                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {conversation.lastMessage ||
                                      "No messages yet"}
                                  </p>

                                  {conversation.unreadCount >
                                    0 && (
                                    <span className="flex-shrink-0 min-w-[20px] h-5 px-1 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center">
                                      {
                                        conversation.unreadCount
                                      }
                                    </span>
                                  )}
                                </div>

                              </div>
                            </div>
                          );
                        }
                      )
                    )}

                  </div>
                </div>

                <div
                  className={`
                    ${
                      selectedConversation
                        ? "flex"
                        : "hidden md:flex"
                    }
                    md:col-span-2
                    flex-col
                  `}
                >
                  {!selectedConversation ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                      <div className="text-center">
                        <FaPaperPlane className="mx-auto text-6xl text-violet-200 dark:text-violet-900" />

                        <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
                          Select a conversation
                        </h2>

                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                          Select a team member to start messaging.
                        </p>

                        <button
                          onClick={() =>
                            setShowNewMessage(true)
                          }
                          className="mt-5 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium transition"
                        >
                          <FaPlus className="inline mr-2" />
                          New Message
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-3">

                        <button
                          onClick={() =>
                            setSelectedConversation(
                              null
                            )
                          }
                          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          <FaArrowLeft />
                        </button>

                        {selectedConversation.user
                          ?.profileImage ? (
                          <img
                            src={
                              selectedConversation
                                .user
                                .profileImage
                            }
                            alt={
                              selectedConversation
                                .user
                                .name
                            }
                            className="w-11 h-11 rounded-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="text-5xl text-violet-500" />
                        )}

                        <div>
                          <h2 className="font-bold text-gray-900 dark:text-white">
                            {
                              selectedConversation
                                .user?.name
                            }
                          </h2>

                          <p className="text-sm text-violet-600 dark:text-violet-400">
                            {
                              selectedConversation
                                .project?.title
                            }
                          </p>

                          {isTyping && (
                            <p className="text-xs text-green-500 mt-1">
                              typing...
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

                        {messageLoading ? (
                          <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
                            Loading messages...
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="flex justify-center items-center h-full">
                            <div className="text-center">
                              <FaPaperPlane className="mx-auto text-4xl text-gray-300 dark:text-gray-600" />

                              <p className="mt-3 text-gray-500 dark:text-gray-400">
                                No messages yet.
                              </p>

                              <p className="text-sm text-gray-400 mt-1">
                                Send the first message.
                              </p>
                            </div>
                          </div>
                        ) : (
                          messages.map((item, index) => {
                            const mine =
                              isMyMessage(item);

                            return (
                              <div
                                key={
                                  item._id ||
                                  `${item.createdAt}-${index}`
                                }
                                className={`flex ${
                                  mine
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`
                                    max-w-[75%]
                                    sm:max-w-[65%]
                                    px-4
                                    py-3
                                    rounded-2xl
                                    ${
                                      mine
                                        ? "bg-violet-600 text-white rounded-br-md"
                                        : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-md"
                                    }
                                  `}
                                >
                                  <p className="text-sm leading-6 whitespace-pre-wrap break-words">
                                    {item.message}
                                  </p>

                                  <p
                                    className={`
                                      text-[10px]
                                      mt-1
                                      ${
                                        mine
                                          ? "text-violet-200"
                                          : "text-gray-400"
                                      }
                                    `}
                                  >
                                    {formatTime(
                                      item.createdAt
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <form
                        onSubmit={handleSendMessage}
                        className="p-4 border-t border-gray-200 dark:border-slate-700"
                      >
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={message}
                            onChange={
                              handleMessageChange
                            }
                            placeholder="Write a message..."
                            disabled={sending}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
                          />

                          <button
                            type="submit"
                            disabled={
                              sending ||
                              !message.trim()
                            }
                            className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            <FaPaperPlane />
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showNewMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">

            <div className="p-5 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  New Message
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Search a project team member.
                </p>
              </div>

              <button
                onClick={closeNewMessage}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-5">

              <div className="relative">
                <FaSearch className="absolute left-4 top-3.5 text-gray-400" />

                <input
                  autoFocus
                  type="text"
                  value={memberSearch}
                  onChange={handleMemberSearch}
                  placeholder="Search by name or email..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {memberLoading && (
                <div className="py-8 text-center text-gray-500">
                  Searching members...
                </div>
              )}

              {!memberLoading &&
                memberSearch.trim() &&
                memberResults.length === 0 && (
                  <div className="py-10 text-center">
                    <FaUsers className="mx-auto text-4xl text-gray-300 dark:text-gray-600" />

                    <p className="mt-3 font-medium text-gray-700 dark:text-gray-300">
                      No members found
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Make sure this user is a member of one of your projects.
                    </p>
                  </div>
                )}

              <div className="mt-4 max-h-72 overflow-y-auto space-y-2">

                {memberResults.map((member) => {
                  const projects =
                    member.projects ||
                    member.commonProjects ||
                    [];

                  return (
                    <div key={member._id}>

                      <button
                        type="button"
                        onClick={() => {
                          if (projects.length > 1) {
                            setSelectedMember(member);
                            setSelectedProject(null);
                          } else {
                            handleStartConversation(
                              member
                            );
                          }
                        }}
                        className="w-full p-3 flex items-center gap-3 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition text-left"
                      >

                        {member.profileImage ? (
                          <img
                            src={member.profileImage}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="text-5xl text-violet-500" />
                        )}

                        <div className="flex-1 min-w-0">

                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {member.name}
                          </h3>

                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {member.email}
                          </p>

                          {projects.length === 1 && (
                            <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                              Project:{" "}
                              {projects[0]?.title ||
                                "Project"}
                            </p>
                          )}

                          {projects.length > 1 && (
                            <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                              {projects.length} common projects
                            </p>
                          )}

                        </div>
                      </button>
                    </div>
                  );
                })}

              </div>

              {selectedMember && (
                <div className="mt-5 border-t border-gray-200 dark:border-slate-700 pt-5">

                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Select Project
                    </h3>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMember(null);
                        setSelectedProject(null);
                      }}
                      className="text-sm text-gray-500 hover:text-red-500"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-2">

                    {(
                      selectedMember.projects ||
                      selectedMember.commonProjects ||
                      []
                    ).map((project) => (
                      <button
                        type="button"
                        key={project._id}
                        onClick={() => {
                          setSelectedProject(project);

                          handleStartConversation(
                            selectedMember,
                            project
                          );
                        }}
                        className={`w-full p-3 rounded-xl border text-left transition ${
                          selectedProject?._id ===
                          project._id
                            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                            : "border-gray-200 dark:border-slate-700 hover:border-violet-400"
                        }`}
                      >
                        <p className="font-medium text-gray-900 dark:text-white">
                          {project.title}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Start conversation in this project
                        </p>
                      </button>
                    ))}

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;