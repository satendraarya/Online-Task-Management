import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: '', dueDate: '', status: '' });

  useEffect(() => {
    // Fetch tasks from the server when the component mounts
    axios.get('/api/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleCreateTask = () => {
    axios.post('/api/tasks', newTask)
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '', priority: '', dueDate: '', status: '' });
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className='main-container-taskmanagement'>
      <div>
        <h1>Task Management</h1>
        <div>
          <h2>Create a Task</h2>
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Priority"
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          />
          <input
            type="text"
            placeholder="Due Date"
            value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
          <input
            type="text" placeholder="Status"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          />
          <button onClick={handleCreateTask}>Create Task</button>
        </div>
        <div>
          <h2>Task List</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Priority: {task.priority}</p>
                <p>Due Date: {task.dueDate}</p>
                <p>Status: {task.status}</p>
                {/* Add buttons for updating and deleting tasks */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TaskManagement;
