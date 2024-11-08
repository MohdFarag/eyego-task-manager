const express = require('express');
const router = express.Router();

const Task = require('./taskSchema');
const Response = require('../../helper/response');
const auth = require('../middleware/authorization');
const { parseDateFromString } = require('../../helper/date');
const { validTitle, validStatus, validId } = require('./validation');

// Constants
const STATUS_BAD_REQUEST = 400;
const STATUS_NOT_FOUND = 404;
const STATUS_SUCCESS = 200;
const STATUS_SERVER_ERROR = 500;

// Helper function for error handling
const handleServerError = (res, error) => res.status(STATUS_SERVER_ERROR).send(Response.error(error.message));

// Middleware for fetching and validating a task by ID
const getTaskById = async (req, res, next) => {
    const { task_id } = req.params;

    if (!await validId(task_id)) {
        return res.status(STATUS_NOT_FOUND).send(Response.fail({ message: "Task not found." }));
    }

    const task = await Task.findById(task_id);
    if (!task) {
        return res.status(STATUS_NOT_FOUND).send(Response.fail({ message: "Task not found." }));
    }

    if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(403).send(Response.fail({ message: "Unauthorized access." }));
    }

    req.task = task;
    next();
};

// Get All Tasks
router.get('/', auth, async (req, res) => {
    try {
        const { status } = req.query;
        const query = { userId: req.user._id, ...(validStatus(status) && { status }) };

        const tasks = await Task.find(query);
        return res.status(STATUS_SUCCESS).send(Response.success({ tasks }));
    } catch (error) {
        return handleServerError(res, error);
    }
});

// Get Task by ID
router.get('/:task_id', auth, getTaskById, async (req, res) => {
    return res.status(STATUS_SUCCESS).send(Response.success(req.task));
});

// Create New Task
router.post('/new', auth, async (req, res) => {
    try {
        const { title, details, time: timeStr, status } = req.body;

        if (!validTitle(title)) {
            return res.status(STATUS_BAD_REQUEST).send(Response.fail({ title: "Title is required." }));
        }

        if (!validStatus(status)) {
            return res.status(STATUS_BAD_REQUEST).send(Response.fail({ title: "Status must be either 'complete' or 'incomplete'." }));
        }

        const task = new Task({
            title,
            details,
            time: parseDateFromString(timeStr),
            status,
            userId: req.user._id,
        });

        await task.save();
        return res.status(201).send(Response.success({ message: "Successfully created new task." }));
    } catch (error) {
        return handleServerError(res, error);
    }
});

// Update Task by ID
router.put('/:task_id', auth, getTaskById, async (req, res) => {
    try {
        const { title, details, time: timeStr, status } = req.body;

        if (title && !validTitle(title)) {
            return res.status(STATUS_BAD_REQUEST).send(Response.fail({ title: "Title is required." }));
        }

        if (status && !validStatus(status)) {
            return res.status(STATUS_BAD_REQUEST).send(Response.fail({ title: "Status must be either 'complete' or 'incomplete'." }));
        }

        Object.assign(req.task, {
            ...(title && { title }),
            ...(details && { details }),
            ...(timeStr && { time: parseDateFromString(timeStr) }),
            ...(status && { status }),
        });

        await req.task.save();
        return res.status(STATUS_SUCCESS).send(Response.success({ message: "Successfully updated a task." }));
    } catch (error) {
        return handleServerError(res, error);
    }
});

// Mark Task as Complete or Incomplete
const markTaskStatus = (status) => async (req, res) => {
    try {
        req.task.status = status;
        await req.task.save();
        return res.status(STATUS_SUCCESS).send(Response.success({ message: `Successfully marked task as ${status}.` }));
    } catch (error) {
        return handleServerError(res, error);
    }
};

router.put('/:task_id/complete', auth, getTaskById, markTaskStatus('complete'));
router.put('/:task_id/incomplete', auth, getTaskById, markTaskStatus('incomplete'));

// Delete All Tasks
router.delete('/all', auth, async (req, res) => {
    try {
        await Task.deleteMany({ userId: req.user._id });
        return res.status(STATUS_SUCCESS).send(Response.success({ message: "Successfully deleted all tasks." }));
    } catch (error) {
        return handleServerError(res, error);
    }
});

// Delete Task by ID
router.delete('/:task_id', auth, getTaskById, async (req, res) => {
    try {
        await req.task.deleteOne();
        return res.status(STATUS_SUCCESS).send(Response.success({ message: "Successfully deleted a task." }));
    } catch (error) {
        return handleServerError(res, error);
    }
});

module.exports = router;
