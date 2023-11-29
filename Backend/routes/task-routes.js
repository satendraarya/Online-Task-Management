const express = require('express');
const { verifyToken } = require('../controllers/user-controllers');
const { 
    createTask, 
    getTasks, 
    updateTask, 
    deleteTask, 
    filterAndSortTasks,
    viewAssignedTasks,
    checkAdminRole,
    assignTask
} = require('../controllers/task-controllers');


const router = express.Router();

router.post('/tasks', verifyToken, createTask);
router.get('/tasks', verifyToken, getTasks);
router.put('/tasks/:taskId', verifyToken, updateTask);
router.delete('/tasks/:taskId', verifyToken, deleteTask);
router.get('/tasks/filter', verifyToken, filterAndSortTasks);
router.post('/assign-task', verifyToken, checkAdminRole, assignTask);
router.get('/tasks/assigned', verifyToken, viewAssignedTasks);



module.exports = router;