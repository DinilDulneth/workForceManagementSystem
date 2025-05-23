const express = require("express");
const router = express.Router();
const Task = require("../model/task");
const WorkingH = require("../model/workingH");
const cloudinary = require("../config/cloudinary");
const taskAttachment = require("../middleware/taskAttachmentUploadMulter");

// Add new task
router.route("/add").post((req, res) => {
  const { tName, description, empID, assignedBy, deadLine, priority } =
    req.body;

  const newTask = new Task({
    tName,
    description,
    empID,
    assignedBy,
    deadLine,
    priority,
    startDate: Date.now()
  });

  newTask
    .save()
    .then(() => {
      res.json("Task uploaded successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

// Fetch all tasks
router.route("/").get((req, res) => {
  Task.find({ status: { $ne: 99 } })
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ status: "Error fetching tasks", error: err.message });
    });
});

// Update task
router.route("/update/:id").put(async (req, res) => {
  try {
    let taskId = req.params.id;
    const { tName, description, deadLine, priority, endDate } = req.body;

    // Create an update object
    const updateTask = { tName, description, deadLine, priority };
    if (endDate !== undefined) {
      updateTask.endDate = endDate;
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateTask, {
      new: true
    });

    if (!updatedTask) {
      return res.status(404).send({ status: "Task not found" });
    }
    res.status(200).send({ status: "Task Updated", task: updatedTask });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "Error updating data", error: err.message });
  }
});

// Update task
router.put("/updateStatus/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status, empID } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        status,
        completionDate: status === 3 ? new Date() : undefined
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message
    });
  }
});

//delete task
router.route("/delete/:id").put(async (req, res) => {
  try {
    let taskId = req.params.id;
    const status = 99;
    const updateTask = { status };
    const updated = await Task.findByIdAndUpdate(taskId, updateTask, {
      new: true
    });

    if (!updateTask) {
      return res.status(404).send({ status: "Task not found" });
    }
    res.status(200).send({ status: "Task Delete", task: updated });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "Error deleting data", error: err.message });
  }
});

//delete task from database
router.route("/deleteFromDatabase/:id").delete(async (req, res) => {
  try {
    let taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);
    res.status(200).send({ status: "Task deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: "Error deleting Task", error: err.message });
  }
});

// Fetch a task by ID
router.route("/get/:id").get(async (req, res) => {
  try {
    let taskID = req.params.id;
    const task = await Task.findById(taskID);
    if (!task || task.status == 99) {
      return res.status(404).send({ status: "Task not found" });
    }

    res.status(200).send({ status: "Task fetched", task: task });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "Error fetching task", error: err.message });
  }
});

// Fetch all task by empID
router.route("/getByEmpID/:empid").get(async (req, res) => {
  try {
    let empid = req.params.empid;
    let status = req.body.status;
    const task = await Task.find({ empID: empid, status: { $ne: 99 } });

    if (!task || task.length === 0) {
      return res.status(404).send({ status: "Task not found" });
    }
    res.status(200).send({ status: "Task fetched by empID", task: task });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "Error fetching task", error: err.message });
  }
});

// Calculate progress
router.route("/progress/:empID").get(async (req, res) => {
  try {
    let empID = req.params.empID;

    // Fetch tasks
    const tasks = await Task.find({ empID: empID, status: { $ne: 99 } });
    const numberOfTasks = tasks.length;

    // Fetch working hours
    const workingHoursRecords = await WorkingH.find({ empID: empID });
    const totalWorkingHours = workingHoursRecords.reduce(
      (sum, record) => sum + parseFloat(record.wHours),
      0
    );

    // Calculate progress
    const progress = totalWorkingHours ? numberOfTasks / totalWorkingHours : 0;

    res.status(200).send({ status: "Progress calculated", progress: progress });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "Error calculating progress", error: err.message });
  }
});

// Calculate progress of each day
router.route("/progressEachDay/:empID").get(async (req, res) => {
  try {
    let empID = req.params.empID;

    // Fetch tasks
    const tasks = await Task.find({ empID: empID, status: { $ne: 99 } });

    // Fetch working hours
    const workingHoursRecords = await WorkingH.find({ empID: empID });

    // Group tasks by date
    const tasksByDate = tasks.reduce((acc, task) => {
      const date = task.startDate
        ? task.startDate.toISOString().split("T")[0]
        : null;
      if (date) {
        if (!acc[date]) acc[date] = [];
        acc[date].push(task);
      }
      return acc;
    }, {});

    // Group working hours by date
    const workingHoursByDate = workingHoursRecords.reduce((acc, record) => {
      const date = record.date ? record.date.toISOString().split("T")[0] : null;
      if (date) {
        if (!acc[date]) acc[date] = 0;
        acc[date] += parseFloat(record.wHours);
      }
      return acc;
    }, {});

    // Calculate progress for each date
    const progressByDate = {};
    for (const date in tasksByDate) {
      const numberOfTasks = tasksByDate[date].length;
      const totalWorkingHours = workingHoursByDate[date] || 0;
      const progress = totalWorkingHours
        ? numberOfTasks / totalWorkingHours
        : 0;
      progressByDate[date] = progress;
    }

    res.status(200).send({
      status: "Progress calculated for each day",
      progress: progressByDate
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "Error calculating progress", error: err.message });
  }
});

//calculate overell employee progress
router.route("/progressOverall").get(async (req, res) => {
  try {
    //Fetch tasks
    const tasks = await Task.find({ status: { $ne: 99 } });
    const numberOfTasks = tasks.length;

    //Fetch Working Hours
    const workingHoursRecords = await WorkingH.find({ status: { $ne: 99 } });
    const totalWorkingHours = workingHoursRecords.reduce(
      (sum, record) => sum + parseFloat(record.wHours),
      0
    );
    //calculate progress
    const progress = totalWorkingHours ? numberOfTasks / totalWorkingHours : 0;
    res
      .status(200)
      .send({ status: "overall prograss calculated", progress: progress });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "Error calculating progress", error: err.message });
  }
});

// Calculate overall progress of each day
router.route("/overallProgressEachDay").get(async (req, res) => {
  try {
    // Fetch tasks
    const tasks = await Task.find({ status: { $ne: 99 } });

    // Fetch working hours
    const workingHoursRecords = await WorkingH.find({});

    // Group tasks by date
    const tasksByDate = tasks.reduce((acc, task) => {
      const date = task.endDate
        ? task.endDate.toISOString().split("T")[0]
        : task.startDate.toISOString().split("T")[0];
      if (date) {
        if (!acc[date]) acc[date] = [];
        acc[date].push(task);
      }
      return acc;
    }, {});

    // Group working hours by date
    const workingHoursByDate = workingHoursRecords.reduce((acc, record) => {
      const date = record.date ? record.date.toISOString().split("T")[0] : null;
      if (date) {
        if (!acc[date]) acc[date] = 0;
        acc[date] += parseFloat(record.wHours);
      }
      return acc;
    }, {});

    // Calculate progress for each date
    const progressByDate = {};
    for (const date in tasksByDate) {
      const numberOfTasks = tasksByDate[date].length;
      const totalWorkingHours = workingHoursByDate[date] || 0;
      const progress = totalWorkingHours
        ? numberOfTasks / totalWorkingHours
        : 0;
      progressByDate[date] = progress;
    }

    res.status(200).send({
      status: "Overall Progress calculated for each day",
      progress: progressByDate
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "Error calculating progress", error: err.message });
  }
});

// Calculate overall progress of each day by EmpID
router.route("/overallProgressEachDayByID/:id").get(async (req, res) => {
  try {
    let empID = req.params.id;

    // Fetch tasks
    const tasks = await Task.find({ empID: empID, status: { $ne: 99 } });

    // Fetch working hours
    const workingHoursRecords = await WorkingH.find({ empID: empID });
    // Group tasks by date
    const tasksByDate = tasks.reduce((acc, task) => {
      const date = task.endDate
        ? task.endDate.toISOString().split("T")[0]
        : task.startDate.toISOString().split("T")[0];

      if (date) {
        if (!acc[date]) acc[date] = [];
        acc[date].push(task);
      }
      return acc;
    }, {});

    // Group working hours by date
    const workingHoursByDate = workingHoursRecords.reduce((acc, record) => {
      const date = record.date ? record.date.toISOString().split("T")[0] : null;
      if (date) {
        if (!acc[date]) acc[date] = 0;
        acc[date] += parseFloat(record.wHours);
      }
      return acc;
    }, {});

    // Calculate progress for each date
    const progressByDate = {};
    for (const date in tasksByDate) {
      const numberOfTasks = tasksByDate[date].length;
      const totalWorkingHours = workingHoursByDate[date] || 0;
      const progress = totalWorkingHours
        ? numberOfTasks / totalWorkingHours
        : 0;
      progressByDate[date] = progress;
    }

    res.status(200).send({
      status: "Employee Overall Progress calculated for each day",
      progress: progressByDate
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "Error calculating progress", error: err.message });
  }
});

// Update task attachment file only
router.put(
  "/uploadTaskAttachment/:id",
  taskAttachment.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });
      }

      const taskId = req.params.id;

      // Delete existing attachment from Cloudinary if it exists
      const existingTask = await Task.findById(taskId);
      if (existingTask && existingTask.attachmentPublicId) {
        await cloudinary.uploader.destroy(existingTask.attachmentPublicId);
      }

      // Upload new file to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "task-attachments",
            public_id: `task_${taskId}_${Date.now()}`
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        // Create buffer stream and pipe to Cloudinary
        const bufferStream = new require("stream").PassThrough();
        bufferStream.end(req.file.buffer);
        bufferStream.pipe(uploadStream);
      });

      // Update task with new attachment details
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
          attachmentPath: result.secure_url,
          attachmentPublicId: result.public_id
        },
        { new: true }
      );

      if (!updatedTask) {
        // If task not found, delete uploaded file
        await cloudinary.uploader.destroy(result.public_id);
        return res.status(404).json({
          success: false,
          message: "Task not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        task: updatedTask,
        attachmentPath: result.secure_url
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading file",
        error: error.message
      });
    }
  }
);

module.exports = router;
