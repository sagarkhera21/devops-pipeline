const request = require('supertest');
const app = require('../src/app');
const userService = require('../src/services/userService');

describe('User API Endpoints', () => {
  let createdUserId;

  beforeAll(() => {
    // Optionally wipe the data before run
    userService.resetUsers();
  });

  it('should create a new user (POST /api/users)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'test@example.com'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toEqual('Test User');
    expect(res.body.email).toEqual('test@example.com');
    // Save id for other tests
    createdUserId = res.body.id;
  });

  it('should fetch all users (GET /api/users)', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should fail to create a user without required fields (POST /api/users)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Incomplete User'
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Name and email are required');
  });

  it('should fetch a specific user by id (GET /api/users/:id)', async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(createdUserId);
    expect(res.body.name).toEqual('Test User');
  });

  it('should update a specific user (PUT /api/users/:id)', async () => {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send({
        name: 'Updated User',
        email: 'updated@example.com'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Updated User');
    expect(res.body.email).toEqual('updated@example.com');
  });

  it('should return 404 for non-existent user update (PUT /api/users/:id)', async () => {
    const res = await request(app)
      .put('/api/users/invalid-id')
      .send({ name: 'Valid Name' });
    expect(res.statusCode).toEqual(404);
  });

  it('should delete a user (DELETE /api/users/:id)', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toEqual(204);

    // Verify it's actually deleted
    const verifyObj = await request(app).get(`/api/users/${createdUserId}`);
    expect(verifyObj.statusCode).toEqual(404);
  });
});
