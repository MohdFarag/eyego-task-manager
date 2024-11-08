const request = require('supertest');
const app = require('../app'); // Adjust according to your file structure
const mongoose = require('mongoose');

require('dotenv').config();

const baseUrl = process.env.BASE_URL;

describe('Signup API', () => {

    afterAll(async () => {
        await mongoose.disconnect();
    });
    
    // Test User Signup
    describe('POST /signup', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post(`${baseUrl}/signup`)
                .send({
                    username: 'newuser',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'johndoe@example.com',
                    password: 'Password123',
                    birthDate: '1990-01-01'
                });

            expect(res.status).toBe(201);
        });

        it('should return 400 for invalid username', async () => {
            const res = await request(app)
                .post(`${baseUrl}/signup`)
                .send({
                    username: '',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'johndoe@example.com',
                    password: 'Password123',
                    birthDate: '1990-01-01'
                });

            expect(res.status).toBe(400);
        });
    });
});
