import TaskCard from "./TaskCard";

function TaskColumn({
  title,
  color,
  tasks,
  fetchTasks,
}) {
  const getHeaderColor = () => {
    switch (color) {
      case "orange":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";

      case "blue":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";

      case "yellow":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";

      case "green":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";

      default:
        return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300";
    }
  };

  return (
    <div
      className="
        bg-white
        dark:bg-slate-800
        rounded-2xl
        border
        border-gray-200
        dark:border-slate-700
        shadow-sm
        flex
        flex-col
        min-h-[650px]
      "
    >
      {/* Header */}

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
        <div className="flex items-center gap-3">
          <span
            className={`
              px-3
              py-1
              rounded-full
              text-sm
              font-semibold
              ${getHeaderColor()}
            `}
          >
            {title}
          </span>

          <span className="text-sm text-gray-500 dark:text-gray-300">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Body */}

      <div
        className="
          flex-1
          p-4
          space-y-4
          overflow-y-auto
        "
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              fetchTasks={fetchTasks}
            />
          ))
        ) : (
          <div
            className="
              h-full
              flex
              items-center
              justify-center
              text-center
              py-12
            "
          >
            <div>
              <div className="text-5xl mb-3">
                📋
              </div>

              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                No Tasks
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                There are no tasks in this column.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskColumn;