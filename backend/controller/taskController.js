import Task from "../model/Task.js";
import Project from "../model/Project.js";
import User from "../model/User.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      assignedTo,
      priority,
      deadline,
      estimatedHours,
      requiredSkills,
      labels,
    } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Title and Project are required.",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      createdBy: req.user._id,
      assignedTo: assignedTo || null,
      priority: priority || "Medium",
      deadline,
      estimatedHours: estimatedHours || 0,
      requiredSkills: requiredSkills || [],
      labels: labels || [],
    });

    const populatedTask = await Task.findById(task._id)
      .populate("createdBy", "name email profileImage")
      .populate("assignedTo", "name email profileImage");

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task: populatedTask,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create task.",
    });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({
      project: projectId,
    })
      .populate("assignedTo", "name email profileImage")
      .populate("createdBy", "name email profileImage")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      totalTasks: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch tasks.",
    });
  }
};

export const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate("createdBy", "name email profileImage")
      .populate("assignedTo", "name email profileImage")
      .populate("comments.user", "name profileImage");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch task.",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      assignedTo,
      priority,
      deadline,
      estimatedHours,
      requiredSkills,
      labels,
    } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.priority = priority || task.priority;
    task.deadline = deadline || task.deadline;
    task.estimatedHours =
      estimatedHours !== undefined
        ? estimatedHours
        : task.estimatedHours;
    task.requiredSkills =
      requiredSkills || task.requiredSkills;
    task.labels = labels || task.labels;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("createdBy", "name email profileImage")
      .populate("assignedTo", "name email profileImage");

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to update task.",
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "Todo",
      "In Progress",
      "Review",
      "Done",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status.",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    task.status = status;

    if (status === "Done") {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email profileImage");

    res.status(200).json({
      success: true,
      message: "Task status updated.",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to update task status.",
    });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    const user = await User.findById(assignedTo);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found.",
      });
    }

    task.assignedTo = assignedTo;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email profileImage");

    res.status(200).json({
      success: true,
      message: "Task assigned successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to assign task.",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty.",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    task.comments.push({
      user: req.user._id,
      text,
    });

    await task.save();

    const updatedTask = await Task.findById(id)
      .populate("createdBy", "name email profileImage")
      .populate("assignedTo", "name email profileImage")
      .populate("comments.user", "name email profileImage");

    res.status(200).json({
      success: true,
      message: "Comment added successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to add comment.",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { taskId, commentId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    const comment = task.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own comments.",
      });
    }

    task.comments.pull(commentId);

    await task.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to delete comment.",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to delete task.",
    });
  }
};
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user._id,
    })
      .populate("project", "title")
      .populate("createdBy", "name email profileImage")
      .sort({
        deadline: 1,
      });

    res.status(200).json({
      success: true,
      totalTasks: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch your tasks.",
    });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({
      assignedTo: userId,
    });

    const todoTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Todo",
    });

    const inProgressTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "In Progress",
    });

    const reviewTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Review",
    });

    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Done",
    });

    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: {
        $ne: "Done",
      },
      deadline: {
        $lt: new Date(),
      },
    });

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const dueToday = await Task.countDocuments({
      assignedTo: userId,
      deadline: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    res.status(200).json({
      success: true,

      stats: {
        totalTasks,
        todoTasks,
        inProgressTasks,
        reviewTasks,
        completedTasks,
        overdueTasks,
        dueToday,
        completionRate,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch task statistics.",
    });
  }
};