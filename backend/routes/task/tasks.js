const express = require('express');
const router = express.Router();

const Task = require('./taskSchema')
const Response = require('../../helper/response');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const auth = require('../middleware/authorization');
const jwt = require('jsonwebtoken');

const { parseDateFromString } = require('../../helper/date');
const { validTitle, validStatus, validId } = require('./validation');

// Get All Tasks
router.get('/', auth, async (req, res) => {
    try {
        let status = req.query.status;
        const query = validStatus(status)
            ? { status, userId: req.user._id } 
            : { userId: req.user._id };

        let tasks = await Task.find(query);

        return res.status(200).send(Response.success({ 
            tasks: tasks,
        }));            
    } catch (error) {
        return res.status(500).send(Response.error(error.message));
    }
});

// Get Task by ID
router.get('/:task_id', auth, async (req, res) => {
    try {
        let taskId = req.params.task_id;
        if(!await validId(taskId)){
            return res.status(404).send(Response.fail({
                message: "Task not found.",
            }));
        }

        let task = await Task.findOne({ _id: taskId });

        if (task.userId != req.user._id) {
            return res.status(403).send(Response.fail({
                message: "Unauthorized access.",
            }));
        }

        return res.status(200).send(Response.success(task));            
    } catch (error) {
        return res.status(500).send(Response.error(error.message));
    }
});

// Create New Task
router.post('/new', auth, async (req, res) => {
    try{
        let title = req.body.title;
        if(!validTitle(title)){
            return res.status(400).send(Response.fail({ 
                title: "Title is required.",
            }));
        }
    
        let details = req.body.details;
        let time = parseDateFromString(req.body.time);
        
        let status = req.body.status;
        if(!validStatus(status)){
            return res.status(400).send(Response.fail({ 
                title: "Status must be either 'complete' or 'incomplete'.",
            }));
        }
    
        let task = new Task({
            title: title,
            details: details,
            time: time,
            status: status,
            userId: req.user._id,
        });
    
        task.save();
    
        return res.status(201).send(Response.success({ 
            message: "Successfully created new task.",
        }));    
    } catch (error) {
        return res.status(500).send(Response.error(error.message));
    }
});

// Update Task by ID
router.put('/:task_id', auth, async (req, res) => {
    try{
        let taskId = req.params.task_id;
        if(!await validId(taskId)){
            return res.status(404).send(Response.fail({
                message: "Task not found.",
            }));
        }
        
        let task = await Task.findOne({ _id: taskId });

        if (task.userId != req.user._id) {
            return res.status(403).send(Response.fail({
                message: "Unauthorized access.",
            }));
        }

        if (req.body.title) {
            if (!validTitle(req.body.title)) {
                return res.status(400).send(Response.fail({ 
                    title: "Title is required.",
                }));
            }
            task.title = req.body.title;
        }

        if (req.body.details) {
            task.details = req.body.details;
        }

        if (req.body.time) {
            task.time = parseDateFromString(req.body.time);
        }
        
        if (req.body.status) {
            if(!validStatus(req.body.status)){
                return res.status(400).send(Response.fail({ 
                    title: "Status must be either 'complete' or 'incomplete'.",
                }));
            }
    
            task.status = req.body.status;
        }    

        task.save();
    
        return res.status(200).send(Response.success({ 
            message: "Successfully updated a task.",
        }));
    } catch (error) {
        return res.status(500).send(Response.error(error.message));
    }
});

// Mark Task as Complete
router.put('/:task_id/complete', auth, async (req, res) => {
    try{
        let taskId = req.params.task_id;
        if(!await validId(taskId)){
            return res.status(404).send(Response.fail({
                message: "Task not found.",
            }));
        }
        
        let task = await Task.findOne({ _id: taskId });

        if (task.userId != req.user._id) {
            return res.status(403).send(Response.fail({
                message: "Unauthorized access.",
            }));
        }

        task.status = 'complete';

        task.save();
    
        return res.status(200).send(Response.success({ 
            message: "Successfully marked task as complete.",
        }));
    } catch (error) {
        return res.status(500).send(Response.error(error.message));
    }
});

// Mark Task as Incomplete
router.put('/:task_id/incomplete', auth, async (req, res) => {
    try{
        let taskId = req.params.task_id;
        if(!await validId(taskId)){
            return res.status(404).send(Response.fail({
                message: "Task not found.",
            }));
        }
        
        let task = await Task.findOne({ _id: taskId });

        if (task.userId != req.user._id) {
            return res.status(403).send(Response.fail({
                message: "Unauthorized access.",
            }));
        }

        task.status = 'incomplete';

        task.save();
    
        return res.status(200).send(Response.success({ 
            message: "Successfully marked task as incomplete.",
        }));
    } catch (error) {
        return res.status(500).send(Response.error(error.message));
    }
});


// Delete All Tasks
router.delete('/', auth, async (req, res) => {
    try{
        const query = { userId: req.user._id };
        
        let task = await Task.deleteMany(query);
        task.save();
    
        return res.status(200).send(Response.success({ 
            message: "Successfully deleted all tasks.",
        }));
    } catch (error) {
        return res.status(500).send(Response.error(error.message));
    }
});

// Delete Task by ID
router.delete('/:task_id', auth, async (req, res) => {
    try{
        let taskId = req.params.task_id;

        if(!await validId(taskId)){
            return res.status(404).send(Response.fail({
                message: "Task not found.",
            }));
        }
        
        let task = await Task.deleteOne({ _id: taskId });

        if (task.userId != req.user._id) {
            return res.status(403).send(Response.fail({
                message: "Unauthorized access.",
            }));
        }

        task.save();
    
        return res.status(200).send(Response.success({ 
            message: "Successfully deleted a task.",
        }));
    } catch (error) {
        return res.status(500).send(Response.error(error.message));
    }
});

// Export the router
module.exports = router;
