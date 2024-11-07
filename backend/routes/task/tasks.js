const express = require('express');
const router = express.Router();

const taskSchema = require('./taskSchema')
const Response = require('../../helper/response');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { parseDateFromString } = require('../../helper/date');
const { validTitle, validStatus, validId } = require('./validation');
const json = require('body-parser/lib/types/json');

// Get All Tasks
router.get('/', async (req, res) => {
    try {
        let status = req.query.status;
        const query = validStatus(status)
            ? { status } 
            : {};

        let tasks = await taskSchema.find(query);

        return res.status(200).send(Response.success({ 
            tasks: tasks,
        }));            
    } catch (error) {
        return res.status(500).send(Response.error(error.message));
    }
});

// Get Task by ID
router.get('/:task_id', async (req, res) => {
    try {
        let taskId = req.params.task_id;
        if(!await validId(taskId)){
            return res.status(404).send(Response.fail({
                message: "Task not found.",
            }));
        }

        let task = await taskSchema.findOne({ _id: taskId });

        return res.status(200).send(Response.success(task));            
    } catch (error) {
        return res.status(500).send(Response.error(error.message));
    }
});

// Create New Task
router.post('/new', async (req, res) => {
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
    
    
        let newTask = new taskSchema({
            title: title,
            details: details,
            time: time,
            status: status,
        });
    
        newTask.save();
    
        return res.status(201).send(Response.success({ 
            message: "Successfully created new task.",
        }));    
    }catch(error){
        return res.status(500).send(Response.error("An error occurred"));
    }
});

// Update Task by ID
router.put('/:task_id', async (req, res) => {
    try{
        let taskId = req.params.task_id;
        if(!await validId(taskId)){
            return res.status(404).send(Response.fail({
                message: "Task not found.",
            }));
        }
        
        let task = await taskSchema.findOne({ _id: taskId });
        
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
    }catch(error){
        return res.status(500).send(Response.error("An error occurred"));
    }
});

// Delete All Tasks
router.delete('/', async (req, res) => {
    try{
        let task = await taskSchema.deleteMany();
        task.save();
    
        return res.status(200).send(Response.success({ 
            message: "Successfully deleted all tasks.",
        }));
    }catch(error){
        return res.status(500).send(Response.error("An error occurred"));
    }
});

// Delete Task by ID
router.delete('/:task_id', async (req, res) => {
    try{
        let taskId = req.params.task_id;
        if(!await validId(taskId)){
            return res.status(404).send(Response.fail({
                message: "Task not found.",
            }));
        }
        
        let task = await taskSchema.deleteOne({ _id: taskId });
        task.save();
    
        return res.status(200).send(Response.success({ 
            message: "Successfully deleted a task.",
        }));
    }catch(error){
        return res.status(500).send(Response.error("An error occurred"));
    }
});

// Mark Task as Complete
router.put('/:task_id/complete', async (req, res) => {
    try{
        let taskId = req.params.task_id;
        if(!await validId(taskId)){
            return res.status(404).send(Response.fail({
                message: "Task not found.",
            }));
        }
        
        let task = await taskSchema.findOne({ _id: taskId });
        task.status = 'complete';

        task.save();
    
        return res.status(200).send(Response.success({ 
            message: "Successfully marked task as complete.",
        }));
    }catch(error){
        return res.status(500).send(Response.error("An error occurred"));
    }
});

// Mark Task as Incomplete
router.put('/:task_id/incomplete', async (req, res) => {
    try{
        let taskId = req.params.task_id;
        if(!await validId(taskId)){
            return res.status(404).send(Response.fail({
                message: "Task not found.",
            }));
        }
        
        let task = await taskSchema.findOne({ _id: taskId });
        task.status = 'incomplete';

        task.save();
    
        return res.status(200).send(Response.success({ 
            message: "Successfully marked task as incomplete.",
        }));
    }catch(error){
        return res.status(500).send(Response.error("An error occurred"));
    }
});

// Export the router
module.exports = router;
