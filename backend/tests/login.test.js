const request = require('supertest');
const app = require('../app'); // Adjust according to your file structure
const mongoose = require('mongoose');
require('dotenv').config();

const baseUrl = process.env.BASE_URL;

let userToken;


describe('Login API', () => {

    afterAll(async () => {
        await mongoose.disconnect();
    });
    
    // Test User Login
    describe('POST /login', () => {
        it('should log in a user and return token', async () => {
            const res = await request(app)
                .post(`${baseUrl}/login`)
                .send({
                    identifier: 'mohdFarag',
                    password: '01016122397Mm'
                });

            userToken = res.header['x-auth-token'];

            expect(res.status).toBe(200);
            expect(userToken).toBeDefined();
        });

        it('should return 400 for invalid credentials', async () => {
            const res = await request(app)
                .post(`${baseUrl}/login`)
                .send({
                    identifier: 'nonexistent@example.com',
                    password: 'WrongPassword'
                });

            expect(res.status).toBe(400);
        });
    });
});
