const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust according to your file structure

require('dotenv').config();

const baseUrl = process.env.BASE_URL;

var userToken;
var taskId;

describe('Task Management API', () => {

    beforeAll(async () => {
        const res = await request(app)
            .post(`${baseUrl}/login`)
            .send({ identifier: 'mohdFarag', password: '01016122397Mm' });
        
        userToken = res.body.data['x-auth-token']; 
    });
    
    
    afterAll(async () => {
        await mongoose.disconnect();
    });

    // Create a new task
    describe('POST /tasks/new', () => {
        it('should create a new task', async () => {
            const res = await request(app)
                .post(`${baseUrl}/tasks/new`)
                .set('x-auth-token', userToken)
                .send({
                    title: 'Test Task',
                    details: 'Test task details',
                    time: '2024-11-08T00:00:00Z',
                    status: 'incomplete'
                });

            taskId = res.body.data._id;

            expect(res.status).toBe(201);
        });

        it('should return 400 for invalid title', async () => {
            const res = await request(app)
                .post(`${baseUrl}/tasks/new`)
                .set('x-auth-token', userToken)
                .send({
                    title: '',
                    details: 'Test task details',
                    time: '2024-11-08T00:00:00Z',
                    status: 'incomplete'
                });

            expect(res.status).toBe(400);
        });
    });

    // Get all tasks
    describe('GET /tasks', () => {
        it('should get all tasks', async () => {
            const res = await request(app)
                .get(`${baseUrl}/tasks`)
                .set('x-auth-token', userToken);

            expect(res.status).toBe(200);
        });
    });

    // Get task by ID
    describe('GET /tasks/:task_id', () => {
        it('should get task by ID', async () => {
            const res = await request(app)
                .get(`${baseUrl}/tasks/${taskId}`)
                .set('x-auth-token', userToken);

            expect(res.status).toBe(200);
        });

        it('should return 404 if task not found', async () => {
            const res = await request(app)
                .get(`${baseUrl}/tasks/invalidtaskid`)
                .set('x-auth-token', userToken);

            expect(res.status).toBe(404);
        });
    });

    // Update task by ID
    describe('PUT /tasks/:task_id', () => {
        it('should update task by ID', async () => {
            const res = await request(app)
                .put(`${baseUrl}/tasks/${taskId}`)
                .set('x-auth-token', userToken)
                .send({
                    title: 'Updated Task',
                    details: 'Updated task details',
                    status: 'complete'
                });

            expect(res.status).toBe(200);
        });
    });

    // Mark task as complete
    describe('PUT /tasks/:task_id/complete', () => {
        it('should mark task as complete', async () => {
            const res = await request(app)
                .put(`${baseUrl}/tasks/${taskId}/complete`)
                .set('x-auth-token', userToken);

            expect(res.status).toBe(200);
        });
    });

    // Delete task by ID
    describe('DELETE /tasks/:task_id', () => {
        it('should delete task by ID', async () => {
            const res = await request(app)
                .delete(`${baseUrl}/tasks/${taskId}`)
                .set('x-auth-token', userToken);

            expect(res.status).toBe(200);
        });
    });

    // Delete all tasks
    describe('DELETE /tasks/all', () => {
        it('should delete all tasks', async () => {
            const res = await request(app)
                .delete(`${baseUrl}/tasks/all`)
                .set('x-auth-token', userToken);

            expect(res.status).toBe(200);
        });
    });
});
