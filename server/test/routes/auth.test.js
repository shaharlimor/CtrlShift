const request = require('supertest');
const express = require('express');
const router = require('../../src/routes/auth');
const User = require('../../src/models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock("../../src/models/users");
const app = express();
app.use(express.json());
app.use('/', router);

describe('Auth Router', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  describe('POST /login', () => {
    test('should return 200 and user details when login is successful', async () => {
      // Mock request body
      const requestBody = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock User.findOne to return a user
      const userMock = {
        _id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organization: 'Example Org',
        tokens: [],
        password: 'mockPassword',
      };
      User.findOne.mockResolvedValueOnce(userMock);

      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare')
      bcryptCompareSpy.mockResolvedValueOnce(true);

      const jwtSignSpy = jest.spyOn(jwt, 'sign');
      jwtSignSpy.mockResolvedValueOnce('mockAccessToken');
      jwtSignSpy.mockResolvedValueOnce('mockRefreshToken');

      // Mock user.save
      const saveMock = jest.fn().mockResolvedValueOnce();
      userMock.save = saveMock;
      const response = await request(app).post('/login').send(requestBody);

      // Assert response
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: {
          _id: '123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          organization: 'Example Org',
          password: "mockPassword",
          tokens: expect.any(Array)
        },
      });
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcryptCompareSpy).toHaveBeenCalledWith('password123', 'mockPassword');
      expect(saveMock).toHaveBeenCalledTimes(1);
    });

    test('should return 500 when login fails due to invalid email or password', async () => {
      // Mock request body
      const requestBody = {
        email: 'test@example.com',
        password: 'password123',
      };

      // user not found
      User.findOne.mockResolvedValueOnce(null);
      const response = await request(app).post('/login').send(requestBody);

      expect(response.statusCode).toBe(500);
      expect(response.text).toBe('bad email or password');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  describe('POST /register', () => {
    test('should return 200 and user details when registration is successful', async () => {
      // Mock request body
      const requestBody = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        organizationName: 'Example Org',
      };

      User.findOne.mockResolvedValueOnce(null);

      const userMock = {
        _id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organization: 'Example Org',
        tokens: [],
        password: 'mockPassword',
      };

      // Mock user.save
      const saveMock = jest.fn().mockResolvedValue(userMock);
      const UserMock = jest.fn().mockImplementation(() => {
        return {
          save: saveMock,
        };
      });

      User.mockImplementation(UserMock);

      // // Mock bcrypt.genSalt and bcrypt.hash
      const bcryptGenSaltSpy = jest.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce('mockSalt');
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('mockHash');

      const response = await request(app).post('/register').send(requestBody);

      expect(response.statusCode).toBe(200);
      expect(response.body.user).toEqual(
        userMock
      );
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcryptHashSpy).toHaveBeenCalledWith('password123', 'mockSalt');;
      expect(saveMock).toHaveBeenCalledTimes(2);
     });

    test('should return 500 when registration fails due to existing user', async () => {
      const requestBody = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        organizationName: 'Example Org',
      };

      User.findOne.mockResolvedValueOnce({
        _id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organization: 'Example Org',
        tokens: [],
        password: 'mockPassword',
      });

      const response = await request(app).post('/register').send(requestBody);

      expect(response.statusCode).toBe(500);
      expect(response.text).toBe('User already exists');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

    test('should return 401 when refresh token is null', async () => {
      const requestHeader = {
        refreshtoken: null,
      };

      const response = await request(app).post('/refreshToken').set(requestHeader);
      expect(response.statusCode).toBe(401);
    });
  });