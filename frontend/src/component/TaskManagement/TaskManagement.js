// src/components/TaskManagement/TaskManagement.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskManagement.css';
axios.defaults.withCredentials = true;

function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    status: 'Incomplete',
  });

  useEffect(() => {
    // Fetch tasks from the backend when the component mounts
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/tasks', {
          withCredentials: true, // Include credentials (cookies) in the request
        });
    
        console.log('Fetch tasks response:', response);
    
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        if (error.response) {
          console.error('Server responded with:', error.response.data);
        }
      }
    };
    

    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8080/api/tasks',
        formData,
        {
          withCredentials: true, // Include credentials (cookies) in the request
        }
      );

      console.log('Task created successfully:', response.data.task);

      setTasks([...tasks, response.data.task]);
      setFormData({
        title: '',
        description: '',
        priority: '',
        dueDate: '',
        status: 'Incomplete',
      });
    } catch (error) {
      console.error('Error creating task:', error.response);
    }
  };


  const handleEditTask = async (taskId) => {
    // Implement the logic for editing a task
    // You may use a modal or another form for editing
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/tasks/${taskId}`,
        { status: newStatus }
      );
      const updatedTasks = tasks.map((task) =>
        task._id === taskId
          ? { ...task, status: response.data.task.status }
          : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="container">
      <div className="task-card">
        <div className="card-body">
          <h1 className="card-title">Task Management</h1>
          <form onSubmit={handleCreateTask}>
            <label>Title:</label>
            <input
              className='task-form'
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />

            <label>Description:</label>
            <textarea
              className='task-form'
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />

            <label>Priority:</label>
            <select
              className='task-form'
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <label>Due Date:</label>
            <input
              className='task-form'
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
            />

            <button className="create-task-button" type="submit" >
              Create Task
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Task List</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                <p>Priority: {task.priority}</p>
                <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                <p>Status: {task.status}</p>
                <button
                  className="task-button"
                  onClick={() => handleEditTask(task._id)}
                >
                  Edit
                </button>
                <button
                  className="task-button"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </button>
                <button
                  className="task-button"
                  onClick={() =>
                    handleStatusChange(
                      task._id,
                      task.status === 'Incomplete'
                        ? 'Complete'
                        : 'Incomplete'
                    )
                  }
                >
                  {task.status === 'Incomplete'
                    ? 'Mark as Complete'
                    : 'Mark as Incomplete'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TaskManagement;








// / import React from 'react'
// import TaskForm from './TaskForm'

// const TaskManagement = () => {
//   return (
//     <div>
//       <TaskForm></TaskForm>
//     </div>
//   )
// }

// export default TaskManagement





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function TaskManagement() {
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState({ title: '', description: '', priority: '', dueDate: '', status: '' });

//   useEffect(() => {
//     // Fetch tasks from the server when the component mounts
//     axios.get('http://192.168.68.28:8080/api/tasks')
//       .then((response) => setTasks(response.data))
//       .catch((error) => console.error(error));
//   }, []);

//   const handleCreateTask = () => {
//     axios.post('http://192.168.68.28:8080/api/tasks', newTask)
//       .then((response) => {
//         setTasks([...tasks, response.data]);
//         setNewTask({ title: '', description: '', priority: '', dueDate: '', status: '' });
//       })
//       .catch((error) => console.error(error));
//   };

//   return (
//     <div className='main-container-taskmanagement'>
//       <div>
//         <h1>Task Management</h1>
//         <div>
//           <h2>Create a Task</h2>
//           <input
//             type="text"
//             placeholder="Title"
//             value={newTask.title}
//             onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Description"
//             value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Priority"
//             value={newTask.priority}
//             onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Due Date"
//             value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
//           />
//           <input
//             type="text" placeholder="Status"
//             value={newTask.status}
//             onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
//           />
//           <button onClick={handleCreateTask}>Create Task</button>
//         </div>
//         <div>
//           <h2>Task List</h2>
//           <ul>
//             {tasks.map((task) => (
//               <li key={task._id}>
//                 <h3>{task.title}</h3>
//                 <p>{task.description}</p>
//                 <p>Priority: {task.priority}</p>
//                 <p>Due Date: {task.dueDate}</p>
//                 <p>Status: {task.status}</p>
//                 {/* Add buttons for updating and deleting tasks */}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TaskManagement;
