const Task = require('./taskSchema')

function validTitle(title){
    return title != "" && title != undefined;
}

function validStatus(status){
    return ['complete', 'incomplete'].includes(status);
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