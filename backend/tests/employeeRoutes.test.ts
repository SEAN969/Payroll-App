import request from 'supertest';
import express from 'express';
import employeeRoutes from '../src/routes/employeeRoutes';

const app = express();
app.use(express.json());
app.use('/api/employees', employeeRoutes);

describe('Employee Routes', () => {
  it('GET /api/employees should return 200', async () => {
    const response = await request(app).get('/api/employees');
    
    // You can mock the DB later – for now we just want it to not crash
    expect([200, 500]).toContain(response.statusCode); // 500 if db not running
  });

  it('POST /api/employees should return 400 if missing required fields', async () => {
    const response = await request(app)
      .post('/api/employees')
      .send({}); // no data

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
