const request = require('supertest');
const express = require('express');
const NotificationModel = require('../../src/models/notifications');
const User = require('../../src/models/user');
const router = require('../../src/routes/notifications'); 

jest.mock("../../src/models/notifications");
jest.mock("../../src/models/user")

describe('Notifications Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/', router);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

  describe('GET /', () => {
    it('should get notifications', async () => {
      // Create a test notification
      const notification = [{ userId: 'user_id', message: 'Test notification' }];
      const mockSort = jest.fn().mockReturnValue(notification); // Mocking the sort function

      // Mock the find function to return an object with the sort function
      NotificationModel.find = jest.fn().mockReturnValue({
        sort: mockSort,
        exec: jest.fn().mockReturnValue(notification),
      });

      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].userId).toBe('user_id');
      expect(response.body[0].message).toBe('Test notification');
    });
  });

  describe('PUT /markAsRead/:notificationId', () => {
    it('should mark notification as read', async () => {
      // Create a test notification
      const notification = { userId: 'user_id', message: 'Test notification' };

      const mockSort = jest.fn().mockReturnValue({ userId: 'user_id', message: 'Test notification', isRead: true }); // Mocking the sort function

      // Mock the find function to return an object with the sort function
      NotificationModel.findOne = jest.fn().mockReturnValue({
        save: mockSort,
        exec: jest.fn().mockReturnValue(notification),
      });

      const response = await request(app).put(`/markAsRead/${notification.userId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.isRead).toBe(true);
    });

    it('should return 404 if notification is not found', async () => {
        NotificationModel.findOne.mockReturnValue(null);
        const response = await request(app).put('/markAsRead/nonexistent_id');
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe('Notification not found');
    });
  });

  describe('DELETE /deleteNotificationById/:notificationId', () => {
    it('should delete notification by ID', async () => {
      // Create a test notification
      const notification = { userId: 'user_id', message: 'Test notification' };

      NotificationModel.deleteOne.mockResolvedValue(notification);
      const response = await request(app).delete(`/deleteNotificationById/${notification._id}`);
      expect(response.statusCode).toBe(204);
    });
  });

  describe('POST /createNotificationForOrganization', () => {
    it('should create notification for organization', async () => {
        // Create a test user with isAdmin set to true
        const user = { isAdmin: true, organization: 'organization_id' };

        const notification = {
            message: 'Test notification',
            type: 'route',
            routeTo: '/test',
        };

        User.findById.mockReturnValue(user);
        User.find = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValue(notification),
            map: jest.fn().mockReturnValue([notification])
            });

        NotificationModel.insertMany.mockReturnValue([notification]);
    
        const response = await request(app)
            .post('/createNotificationForOrganization')
            .send(notification);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].message).toBe('Test notification');
        expect(response.body[0].type).toBe('route');
        expect(response.body[0].routeTo).toBe('/test');
    });

//     it('should return 403 if user is not an admin', async () => {
//       // Create a test user with isAdmin set to false
//       const user = new User({ isAdmin: false, organization: 'organization_id' });
//       await user.save();

//       const notification = {
//         message: 'Test notification',
//         type: 'route',
//         routeTo: '/test',
//       };

//       const response = await request(app)
//         .post('/createNotificationForOrganization')
//         .send(notification);
//       expect(response.statusCode).toBe(403);
//       expect(response.text).toBe('User is not an admin');
//     });

//     it('should return 400 if type is "route" but routeTo is not provided', async () => {
//       // Create a test user with isAdmin set to true
//       const user = new User({ isAdmin: true, organization: 'organization_id' });
//       await user.save();

//       const notification = {
//         message: 'Test notification',
//         type: 'route',
//       };

//       const response = await request(app)
//         .post('/createNotificationForOrganization')
//         .send(notification);
//       expect(response.statusCode).toBe(400);
//       expect(response.text).toBe('RouteTo is required when type is \'route\'');
//     });
//   });

//   describe('POST /sendSwitchNotification/:userId', () => {
//     it('should send switch notification', async () => {
//       // Create test users in the same organization
//       const currentUser = new User({
//         organization: 'organization_id',
//         firstName: 'John',
//         lastName: 'Doe',
//       });
//       await currentUser.save();

//       const targetUser = new User({ organization: 'organization_id' });
//       await targetUser.save();

//       const response = await request(app).post(`/sendSwitchNotification/${targetUser._id}`);
//       expect(response.statusCode).toBe(200);
//       expect(response.body.userId).toBe(targetUser._id);
//       expect(response.body.message).toContain('John Doe proposed a shift change');
//       expect(response.body.type).toBe('switch');
//     });

//     it('should return 404 if target user is not found', async () => {
//       const response = await request(app).post('/sendSwitchNotification/nonexistent_id');
//       expect(response.statusCode).toBe(404);
//       expect(response.text).toBe('Target user not found');
//     });

//     it('should return 403 if users are not in the same organization', async () => {
//       // Create test users in different organizations
//       const currentUser = new User({ organization: 'organization1_id' });
//       await currentUser.save();

//       const targetUser = new User({ organization: 'organization2_id' });
//       await targetUser.save();

//       const response = await request(app).post(`/sendSwitchNotification/${targetUser._id}`);
//       expect(response.statusCode).toBe(403);
//       expect(response.text).toBe('Users are not in the same organization');
//     });
  });
});
