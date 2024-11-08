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

const MESSAGES = {
    TASK_NOT_FOUND: 'Task not found.',
    UNAUTHARIZED_ACCESS: 'Unauthorized access.',
    REQUIRED_TITLE: 'Title is required.',
    INVALID_STATUS: "Status must be either 'complete' or 'incomplete'.",
    TASK_CREATED: 'Successfully created new task.',
    TASK_UPDATED: 'Successfully updated a task.',
    TASK_MARKED: 'Successfully marked task as ',
    TASK_DELETED: 'Successfully deleted a task.',
    TASKS_DELETED: 'Successfully deleted all tasks.',
};

const handleServerError = (res, error) => res.status(STATUS_SERVER_ERROR).send(Response.error(error.message));

const getTaskById = async (req, res, next) => {
    const { task_id } = req.params;

    if (!await validId(task_id)) {
        return res.status(STATUS_NOT_FOUND).send(Response.fail({ message: MESSAGES.TASK_NOT_FOUND }));
    }

    const task = await Task.findById(task_id);
    if (!task) {
        return res.status(STATUS_NOT_FOUND).send(Response.fail({ message: MESSAGES.TASK_NOT_FOUND }));
    }

    if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(403).send(Response.fail({ message: MESSAGES.UNAUTHARIZED_ACCESS }));
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
            return res.status(STATUS_BAD_REQUEST).send(Response.fail({ title: MESSAGES.REQUIRED_TITLE }));
        }

        if (!validStatus(status)) {
            return res.status(STATUS_BAD_REQUEST).send(Response.fail({ title: MESSAGES.INVALID_STATUS }));
        }

        const task = new Task({
            title,
            details,
            time: parseDateFromString(timeStr),
            status,
            userId: req.user._id,
        });

        await task.save();
        return res.status(201).send(Response.success({ message: MESSAGES.TASK_CREATED, _id: task._id }));
    } catch (error) {
        return handleServerError(res, error);
    }
});

// Update Task by ID
router.put('/:task_id', auth, getTaskById, async (req, res) => {
    try {
        const { title, details, time: timeStr, status } = req.body;

        if (!validTitle(title)) {
            return res.status(STATUS_BAD_REQUEST).send(Response.fail({ title: MESSAGES.REQUIRED_TITLE }));
        }

        if (!validStatus(status)) {
            return res.status(STATUS_BAD_REQUEST).send(Response.fail({ title: MESSAGES.INVALID_STATUS }));
        }

        Object.assign(req.task, {
            ...(title && { title }),
            ...(details && { details }),
            ...(timeStr && { time: parseDateFromString(timeStr) }),
            ...(status && { status }),
        });

        await req.task.save();
        return res.status(STATUS_SUCCESS).send(Response.success({ message: MESSAGES.TASK_UPDATED }));
    } catch (error) {
        return handleServerError(res, error);
    }
});

// Mark Task as Complete or Incomplete
const markTaskStatus = (status) => async (req, res) => {
    try {
        req.task.status = status;
        await req.task.save();
        return res.status(STATUS_SUCCESS).send(Response.success({ message: `${MESSAGES.TASK_MARKED} ${status}.` }));
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
        return res.status(STATUS_SUCCESS).send(Response.success({ message: MESSAGES.TASKS_DELETED }));
    } catch (error) {
        return handleServerError(res, error);
    }
});

// Delete Task by ID
router.delete('/:task_id', auth, getTaskById, async (req, res) => {
    try {
        await req.task.deleteOne();
        return res.status(STATUS_SUCCESS).send(Response.success({ message: MESSAGES.TASK_DELETED }));
    } catch (error) {
        return handleServerError(res, error);
    }
});

module.exports = router;
