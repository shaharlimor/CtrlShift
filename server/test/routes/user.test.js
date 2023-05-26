const request = require('supertest');
const express = require('express');
const router = require('../../src/routes/user');
const userModel = require('../../src/models/user');
jest.mock('../../src/models/user');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());
app.use('/', router);

describe('User Routes', () => {
  afterEach(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  // delete
  describe('POST /users/delete/:id', () => {
    it('should delete a user', async () => {
      const userId = '1';
      const response = await request(app).post(`/delete/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted successfully');
    });

    it('should return an error when deleting a user', async () => {
      const userId = 'invalidUserId';
      userModel.findOneAndDelete.mockRejectedValue(new Error());
      const response = await request(app).post(`/delete/${userId}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error deleting user');
    });
  });

  // Create
  describe('POST /users/create', () => {
    it('should create a new user', async () => {
      userModel.create.mockResolvedValueOnce({
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com'
      });
      
      const bcryptGenSaltSpy = jest.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce('mock');
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('mock');
 
      const response = await request(app)
        .post('/create')
        .send({
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User created successfully');
    });

    it('should return an error when user already exists', async () => {
      userModel.findOne.mockResolvedValueOnce({
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      });
      
      const bcryptGenSaltSpy = jest.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce('mockSalt');
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('mockHash');
       
      const response = await request(app)
        .post('/create')
        .send({
          id: '1',
          email: 'existing@example.com',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(500);
      expect(response.text).toBe('User already exists');
    });
  });

  // Test for POST /users/update
  describe('POST /users/update', () => {
    it('should update a user', async () => {
      userModel.updateOne.mockResolvedValueOnce({
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com'
      });

      const response = await request(app)
        .post('/update')
        .send({
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User updated successfully');
    });

    it('should return an error when updating a user', async () => {
      userModel.updateOne.mockRejectedValueOnce(new Error('Error updating user'));

      const response = await request(app)
        .post('/update')
        .send({
          id: 'invalidId',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error update user details');
    });
  });

  // get users
  describe('GET /users/users', () => {
    it('should get all users by organization', async () => {
      const organization = 'exampleOrg';
      const users = [
        { _id: '1', firstName: 'John', lastName: 'Doe', email: 'test1@example.com' },
        { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'test2@example.com' }
      ];
      userModel.find.mockResolvedValueOnce(users);

      const response = await request(app).get(`/users?organization=${organization}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('All users');
      expect(response.body.users).toEqual(users);
    });

    it('should return an error when getting all users', async () => {
      userModel.find.mockRejectedValueOnce(new Error('Error getting all users'));

      const response = await request(app).get('/users');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error getting all users');
    });
  });

  // Get employees
  describe('GET /users/employees', () => {
    it('get employees', async () => {
    userModel.find.mockResolvedValueOnce([{ firstName: 'John', lastName: 'Doe' }]);

    const userIds = '1,2,3';
    const response = await request(app)
      .get(`/getEmployeesDetails/${userIds}`)
      .expect(200);

    expect(response.body).toEqual([{ firstName: 'John', lastName: 'Doe' }]);
    });

    it('should return an error when getting employees details', async () => {
      userModel.find.mockRejectedValueOnce(new Error('some error'));

      const userIds = '1,2,3';
      const response = await request(app).get(`/getEmployeesDetails/${userIds}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error with getting employess details');
    });
  });
});
