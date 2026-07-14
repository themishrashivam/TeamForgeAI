import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

function JoinRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/requests");

      console.log("Requests Response:", res.data);

      setRequests(res.data.requests || []);
    } catch (error) {
      console.log("Fetch Request Error:", error);
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await api.put(`/accept/${id}`);

      setRequests((prev) =>
        prev.filter((req) => req._id !== id)
      );
    } catch (error) {
      console.log("Accept Error:", error);
      console.log(error?.response?.data);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/reject/${id}`);

      setRequests((prev) =>
        prev.filter((req) => req._id !== id)
      );
    } catch (error) {
      console.log("Reject Error:", error);
      console.log(error?.response?.data);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Topbar />

        <div className="p-4 md:p-6">

          <h1 className="text-3xl font-bold mb-6">
            Join Requests
          </h1>

          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              No Pending Requests
            </div>
          ) : (
            <div className="grid gap-6">

              {requests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-2xl p-6 shadow-sm border"
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-6">

                    <div>
                      <h2 className="text-xl font-semibold">
                        {request.project?.title}
                      </h2>

                      <p className="text-gray-600 mt-2">
                        Requested By:
                        {" "}
                        <span className="font-medium">
                          {request.sender?.name}
                        </span>
                      </p>

                      <p className="text-gray-500">
                        {request.sender?.email}
                      </p>

                      {request.message && (
                        <p className="text-gray-500 mt-2">
                          {request.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleAccept(request._id)
                        }
                        className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          handleReject(request._id)
                        }
                        className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JoinRequests;