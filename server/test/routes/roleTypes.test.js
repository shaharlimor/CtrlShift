const request = require('supertest');
const express = require('express');
const router = require('../../src/routes/roleTypes');
const ShiftRoles = require('../../src/models/shiftRoles');
jest.mock('../../src/models/shiftRoles');

describe('Role Types Router', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /:orgId', () => {
    it('should get role types', async () => {
      const orgId = 'orgId'; // Organization ID
      const roles = [{ _id: 'roleId', name: 'Role 1' }]; // Example roles

      ShiftRoles.find.mockResolvedValue(roles);

      const response = await request(app).get(`/${orgId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(roles);
      expect(ShiftRoles.find).toHaveBeenCalledWith({ organization: orgId });
    });
  });

  describe('POST /create', () => {
    it('should create a role', async () => {
      const roleData = {
        organization: 'orgId',
        roleType: 'Role Type',
      };
      ShiftRoles.create.mockResolvedValue(roleData);

      const response = await request(app).post('/create').send(roleData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'role created successfully' });
    });
  });

  describe('POST /update', () => {
    it('should update a role', async () => {
      const roleData = {
        _id: 'roleId',
        organization: 'orgId',
        roleType: 'Updated Role Type',
      };
      ShiftRoles.findOneAndUpdate.mockResolvedValue(roleData);

      const response = await request(app).post('/update').send(roleData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'role updated successfully', role: roleData });
      expect(ShiftRoles.findOneAndUpdate).toHaveBeenCalledWith({ _id: roleData._id }, { organization: roleData.organization, roleType: roleData.roleType }, { new: true });
      });
    })

    describe('POST /update', () => {
        it('should update a role', async () => {
          const roleData = {
            _id: 'roleId',
            organization: 'orgId',
            roleType: 'Updated Role Type',
          };
          ShiftRoles.findOneAndUpdate.mockResolvedValue(roleData);
    
          const response = await request(app).post('/update').send(roleData);
    
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({ message: 'role updated successfully', role: roleData });
          expect(ShiftRoles.findOneAndUpdate).toHaveBeenCalledWith({ _id: roleData._id }, { organization: roleData.organization, roleType: roleData.roleType }, { new: true });
        });
    
        it('should handle errors when updating a role', async () => {
          const roleData = {
            _id: 'roleId',
            organization: 'orgId',
            roleType: 'Updated Role Type',
          };
          ShiftRoles.findOneAndUpdate.mockRejectedValue(new Error('Database error'));
    
          const response = await request(app).post('/update').send(roleData);
    
          expect(response.statusCode).toBe(500);
          expect(response.body).toEqual({ message: 'Error updating role' });
          expect(ShiftRoles.findOneAndUpdate).toHaveBeenCalledWith({ _id: roleData._id }, { organization: roleData.organization, roleType: roleData.roleType }, { new: true });
        });
      });
    
      describe('POST /delete', () => {
        it('should delete a role', async () => {
          const roleId = 'roleId';
    
          const response = await request(app).post('/delete').send({ _id: roleId });
    
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({ message: 'Role deleted successfully' });
          expect(ShiftRoles.findOneAndDelete).toHaveBeenCalledWith({ _id: roleId });
        });
    
        it('should handle errors when deleting a role', async () => {
          const roleId = 'roleId';
          ShiftRoles.findOneAndDelete.mockRejectedValue(new Error('Database error'));
    
          const response = await request(app).post('/delete').send({ _id: roleId });
    
          expect(response.statusCode).toBe(500);
          expect(response.body).toEqual({ message: 'Error deleting role' });
          expect(ShiftRoles.findOneAndDelete).toHaveBeenCalledWith({ _id: roleId });
        });
      });
    });
    