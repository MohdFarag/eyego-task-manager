const Task = require('./taskSchema')

function validTitle(title){
    return title != "" && title != undefined;
}

function validStatus(status) {
    const validStatuses = ['complete', 'incomplete'];
    return validStatuses.includes(status);
}

async function validId(taskId) {
    try {
        await Task.findOne({ _id: taskId });
        return true;        
    } catch (error) {
        return false;
    }
}

module.exports = {
    validTitle,
    validStatus,
    validId,
};