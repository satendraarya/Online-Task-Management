const Task = require('../model/Task');

const createTask = async (req, res) => {
    const { title, description, priority, dueDate, status } = req.body;
    const user = req.id;

    try {
        const task = new Task({ title, discription, dueDate, priority, status, user });
        await task.save();
        return res.status(201).json({ message: "Task created successfully", task });
    } catch (err) {
        return res.status(500).json({ message: "Task creation faild", error: err.message });
    }
};

const getTasks = async (req, res) => {
    const user = req.id; // user authentication middleware
    try {
        const tasks = await Task.find({ user })
        return res.status(200).json({ tasks }); 
    } catch (err) {
        return res.status(500).json({ message: "Error fetching tasks", error: err.message });
    }
};

const updateTask = async (req, res) => {
    const taskId = req.params.taskId;
    const { title, description, priority, dueDate, status } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(
            taskId,
            { title, description, priority, dueDate, status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.status(200).json({ message: 'Task updated successfully', task });
    } catch (err) {
        return res.status(500).json({ message: 'Task update faild', error: err.message });
    }
};

const deleteTask = async (req, res) => {
    const taskId = req.params.taskId;

    try {
        const task = await Task.findByIdAndRemove(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Task deletion failed', error: err.message });
    }
};

const filterAndSortTasks = async (req, res) => {
    const user = req.id;
    const { priority, dueDate, status } = req.query;
  
    const filter = { user };
  
    if (priority) {
      filter.priority = priority;
    }
  
    if (dueDate) {
      filter.dueDate = { $gte: new Date(dueDate) };
    }
  
    if (status) {
      filter.status = status;
    }
  
    try {
      const tasks = await Task.find(filter).sort({ dueDate: 1 });
      return res.status(200).json({ tasks });
    } catch (err) {
      return res.status(500).json({ message: 'Error filtering and sorting tasks', error: err.message });
    }
};

const checkAdminRole = (req, res, next) => {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    next();
};

const viewAssignedTasks = async (req, res) => {
    const user = req.id;
  
    try {
      const tasks = await Task.find({ user });
      return res.status(200).json({ tasks });
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching assigned tasks', error: err.message });
    }
};

const assignTask = async (req, res) => {
    const { userId, taskId } = req.body;

    // Check if the administrator wants to assign the task to a valid user
    const userToAssign = await User.findById(userId);
    if (!userToAssign) {
        return res.status(404).json({ message: "User not found" });
    }
    
    // Assign the task to the user
    try {
        const task = await Task.findById(taskId);
        if(!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.user = userId;
        await task.save();
        return res.status(200).json({ message: "Task assigned to the user" });
    } catch (err) {
        return res.status(500).json({ message: 'Error assigning the task', error: err.message });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask, filterAndSortTasks, checkAdminRole, viewAssignedTasks, assignTask };