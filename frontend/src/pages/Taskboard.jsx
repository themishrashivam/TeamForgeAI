import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

import TaskColumn from "../components/tasks/TaskColumn.jsx";
import CreateTaskModal from "../components/tasks/createTaskModal.jsx";

import api from "../services/api.js";

function TaskBoard() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // ===========================================
    // Fetch Profile
    // ===========================================

    const fetchProfile = async () => {
        try {
            const res = await api.get("/profile");
            setUser(res.data.user);
        } catch (err) {
            console.log("Profile Error:", err);
        }
    };

    // ===========================================
    // Fetch Tasks
    // ===========================================

    const fetchTasks = async () => {
        if (!projectId) {
            console.error("Project ID is missing.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const res = await api.get(
                `/tasks/project/${projectId}`
            );

            setTasks(res.data?.tasks || []);
        } catch (err) {
            console.log("Fetch Tasks Error:", err);

            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    // ===========================================
    // Initial Load
    // ===========================================

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (projectId) {
            fetchTasks();
        } else {
            setLoading(false);
        }
    }, [projectId]);

    // ===========================================
    // Missing Project ID
    // ===========================================

    if (!projectId && !loading) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex">
                <Sidebar />

                <div className="flex-1 md:ml-64">
                    <Topbar user={user} />

                    <div className="min-h-[80vh] flex items-center justify-center p-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10 text-center max-w-md">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Project Not Found
                            </h2>

                            <p className="mt-3 text-gray-500 dark:text-gray-300">
                                A valid project ID is required to open the task board.
                            </p>

                            <button
                                onClick={() => navigate("/dashboard")}
                                className="
                                    mt-6
                                    px-6
                                    py-3
                                    rounded-xl
                                    bg-violet-600
                                    hover:bg-violet-700
                                    text-white
                                    transition
                                "
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ===========================================
    // Loading
    // ===========================================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        Loading Tasks...
                    </p>
                </div>
            </div>
        );
    }

    // ===========================================
    // Filter Tasks
    // ===========================================

    const todoTasks = tasks.filter(
        (task) => task.status === "Todo"
    );

    const inProgressTasks = tasks.filter(
        (task) => task.status === "In Progress"
    );

    const reviewTasks = tasks.filter(
        (task) => task.status === "Review"
    );

    const doneTasks = tasks.filter(
        (task) => task.status === "Done"
    );

    // ===========================================
    // Statistics
    // ===========================================

    const totalTasks = tasks.length;

    const completedTasks = doneTasks.length;

    const progress =
        totalTasks === 0
            ? 0
            : Math.round(
                  (completedTasks / totalTasks) * 100
              );

    // ===========================================
    // Task Created
    // ===========================================

    const handleTaskCreated = () => {
        setShowModal(false);
        fetchTasks();
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex">

            <Sidebar />

            <div className="flex-1 md:ml-64">

                <Topbar user={user} />

                <div className="p-4 sm:p-6">

                    {/* ===========================================
                        Header
                    ============================================ */}

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">

                        <div>

                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Project Task Board
                            </h1>

                            <p className="text-gray-500 dark:text-gray-300 mt-2">
                                Manage your project tasks efficiently.
                            </p>

                        </div>

                        <button
                            onClick={() => setShowModal(true)}
                            className="
                                px-6
                                py-3
                                bg-violet-600
                                hover:bg-violet-700
                                text-white
                                rounded-xl
                                transition
                                font-semibold
                            "
                        >
                            + Create Task
                        </button>

                    </div>

                    {/* ===========================================
                        Statistics
                    ============================================ */}

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5 mb-8">

                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                            <h3 className="text-gray-500 dark:text-gray-300 text-sm">
                                Total
                            </h3>

                            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                                {totalTasks}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                            <h3 className="text-gray-500 dark:text-gray-300 text-sm">
                                Todo
                            </h3>

                            <p className="text-3xl font-bold mt-2 text-orange-500">
                                {todoTasks.length}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                            <h3 className="text-gray-500 dark:text-gray-300 text-sm">
                                Progress
                            </h3>

                            <p className="text-3xl font-bold mt-2 text-blue-500">
                                {inProgressTasks.length}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                            <h3 className="text-gray-500 dark:text-gray-300 text-sm">
                                Review
                            </h3>

                            <p className="text-3xl font-bold mt-2 text-yellow-500">
                                {reviewTasks.length}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                            <h3 className="text-gray-500 dark:text-gray-300 text-sm">
                                Completed
                            </h3>

                            <p className="text-3xl font-bold mt-2 text-green-500">
                                {completedTasks}
                            </p>
                        </div>

                    </div>

                    {/* ===========================================
                        Progress Bar
                    ============================================ */}

                    <div className="mb-8">

                        <div className="flex justify-between mb-2">

                            <span className="font-semibold text-gray-700 dark:text-gray-200">
                                Project Progress
                            </span>

                            <span className="font-bold text-violet-600">
                                {progress}%
                            </span>

                        </div>

                        <div className="w-full bg-gray-300 dark:bg-slate-700 h-3 rounded-full overflow-hidden">

                            <div
                                className="bg-violet-600 h-full transition-all duration-500"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />

                        </div>

                    </div>

                    {/* ===========================================
                        Kanban Board
                    ============================================ */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            xl:grid-cols-4
                            gap-6
                        "
                    >

                        <TaskColumn
                            title="Todo"
                            color="orange"
                            tasks={todoTasks}
                            fetchTasks={fetchTasks}
                        />

                        <TaskColumn
                            title="In Progress"
                            color="blue"
                            tasks={inProgressTasks}
                            fetchTasks={fetchTasks}
                        />

                        <TaskColumn
                            title="Review"
                            color="yellow"
                            tasks={reviewTasks}
                            fetchTasks={fetchTasks}
                        />

                        <TaskColumn
                            title="Done"
                            color="green"
                            tasks={doneTasks}
                            fetchTasks={fetchTasks}
                        />

                    </div>

                    {/* ===========================================
                        Empty State
                    ============================================ */}

                    {tasks.length === 0 && (
                        <div
                            className="
                                mt-10
                                bg-white
                                dark:bg-slate-800
                                border
                                border-gray-200
                                dark:border-slate-700
                                rounded-2xl
                                p-12
                                text-center
                            "
                        >

                            <h2
                                className="
                                    text-2xl
                                    font-bold
                                    text-gray-900
                                    dark:text-white
                                "
                            >
                                No Tasks Yet
                            </h2>

                            <p
                                className="
                                    mt-3
                                    text-gray-500
                                    dark:text-gray-300
                                "
                            >
                                Create your first task to start managing
                                your project.
                            </p>

                            <button
                                onClick={() => setShowModal(true)}
                                className="
                                    mt-6
                                    px-6
                                    py-3
                                    rounded-xl
                                    bg-violet-600
                                    hover:bg-violet-700
                                    text-white
                                    transition
                                "
                            >
                                + Create Task
                            </button>

                        </div>
                    )}

                    {/* ===========================================
                        Create Task Modal
                    ============================================ */}

                    {showModal && (
                        <CreateTaskModal
                            projectId={projectId}
                            onClose={() => setShowModal(false)}
                            onTaskCreated={handleTaskCreated}
                        />
                    )}

                </div>
            </div>
        </div>
    );
}

export default TaskBoard;