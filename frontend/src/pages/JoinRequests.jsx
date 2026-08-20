import { useEffect, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaUserCircle,
  FaProjectDiagram,
  FaEnvelope,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

function JoinRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/requests");

      setRequests(res.data.requests || []);
    } catch (error) {
      console.log("Fetch Request Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load join requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      setProcessingId(id);
      setError("");

      await api.put(`/accept/${id}`);

      setRequests((prev) =>
        prev.filter((request) => request._id !== id)
      );
    } catch (error) {
      console.log("Accept Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to accept request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setProcessingId(id);
      setError("");

      await api.put(`/reject/${id}`);

      setRequests((prev) =>
        prev.filter((request) => request._id !== id)
      );
    } catch (error) {
      console.log("Reject Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to reject request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-slate-900 flex">
        <Sidebar />

        <div className="flex-1 md:ml-64">
          <Topbar />

          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

              <p className="mt-4 text-gray-500 dark:text-gray-300">
                Loading Join Requests...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-slate-900 flex">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Topbar />

        <main className="p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto">

            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Join Requests
              </h1>

              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Manage students who want to join your projects.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pending Requests
                </p>

                <p className="text-3xl font-bold text-violet-600 mt-2">
                  {requests.length}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Projects
                </p>

                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {
                    new Set(
                      requests
                        .map((request) => request.project?._id)
                        .filter(Boolean)
                    ).size
                  }
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Applicants
                </p>

                <p className="text-3xl font-bold text-green-600 mt-2">
                  {
                    new Set(
                      requests
                        .map((request) => request.sender?._id)
                        .filter(Boolean)
                    ).size
                  }
                </p>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto">
                  <FaProjectDiagram className="text-2xl text-violet-600" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-5">
                  No Pending Requests
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  You don't have any pending team join requests.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {requests.map((request) => {
                  const sender = request.sender;
                  const project = request.project;
                  const isProcessing =
                    processingId === request._id;

                  return (
                    <div
                      key={request._id}
                      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                        <div className="flex gap-4">

                          <div className="flex-shrink-0">
                            {sender?.profileImage ? (
                              <img
                                src={sender.profileImage}
                                alt={sender.name}
                                className="w-14 h-14 rounded-full object-cover"
                              />
                            ) : (
                              <FaUserCircle className="text-5xl text-violet-500" />
                            )}
                          </div>

                          <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                              {sender?.name || "Unknown User"}
                            </h2>

                            {sender?.email && (
                              <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <FaEnvelope />
                                {sender.email}
                              </p>
                            )}

                            <div className="flex items-center gap-2 mt-3">
                              <FaProjectDiagram className="text-violet-500" />

                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                Wants to join:
                              </span>

                              <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                                {project?.title || "Project"}
                              </span>
                            </div>

                            {sender?.skills?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {sender.skills
                                  .slice(0, 6)
                                  .map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 rounded-full text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                              </div>
                            )}

                            {sender?.bio && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-2xl">
                                {sender.bio}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 lg:min-w-[220px]">

                          <button
                            onClick={() =>
                              handleAccept(request._id)
                            }
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaCheck />

                            {isProcessing
                              ? "Processing..."
                              : "Accept"}
                          </button>

                          <button
                            onClick={() =>
                              handleReject(request._id)
                            }
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaTimes />

                            {isProcessing
                              ? "Processing..."
                              : "Reject"}
                          </button>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default JoinRequests;