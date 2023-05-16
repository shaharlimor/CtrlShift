const request = require('supertest');
const express = require('express');
const router = require('../../src/routes/permanentShifts'); 
const Shift = require('../../src/models/permanentShifts');
jest.mock('../../src/models/permanentShifts');

describe('Permanent Shifts Router', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/', router);
  });

  describe('GET /:orgId', () => {
    it('should get shifts', async () => {
      const shifts = [{ name: 'Shift 1' }, { name: 'Shift 2' }];
      const orgId = 'orgId'; // Organization ID
      Shift.find.mockResolvedValue(shifts);

      const response = await request(app).get(`/${orgId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(shifts);
      expect(Shift.find).toHaveBeenCalledWith({ organization: orgId });
    });

    it('should handle errors when getting shifts', async () => {
      const orgId = 'orgId';
      const errorMessage = 'Database error';
      Shift.find.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).get(`/${orgId}`);

    //   expect(response.statusCode).toBe(500);
      expect(response.text).toBe(`error occured to get shifts: Error: ${errorMessage}`);
      expect(Shift.find).toHaveBeenCalledWith({ organization: orgId });
    });
  });

  describe('POST /create', () => {
    it('should create a shift', async () => {
      const shift = { name: 'Shift 1' };
      Shift.prototype.save.mockResolvedValue(shift);

      const response = await request(app).post('/create').send(shift);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Shift created successfully'});
      expect(Shift.prototype.save).toHaveBeenCalled();
    });

    it('should handle errors when creating a shift', async () => {
      const shift = { name: 'Shift 1' };
      Shift.prototype.save.mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/create').send(shift);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: 'Error creating shift' });
      expect(Shift.prototype.save).toHaveBeenCalled();
    });
  });

  describe('POST /delete', () => {
    it('should delete a shift', async () => {
      const shiftId = 'shiftId'; // Shift ID to delete
      Shift.findOneAndDelete.mockResolvedValue({});

      const response = await request(app).post('/delete').send({ id: shiftId });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Shift deleted successfully' });
      expect(Shift.findOneAndDelete).toHaveBeenCalledWith({ _id: shiftId });
    });

    it('should handle errors when deleting a shift', async () => {
      const shiftId = 'shiftId';
      Shift.findOneAndDelete.mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/delete').send({ id: shiftId });

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: 'Error deleting shift' });
      expect(Shift.findOneAndDelete)      .toHaveBeenCalledWith({ _id: shiftId });
    });
  });
  
  describe('POST /update', () => {
    it('should update a shift', async () => {
      const shiftId = 'shiftId'; // Shift ID to update
      const updatedShift = { _id: shiftId, name: 'Updated Shift' };

      Shift.findOneAndUpdate.mockResolvedValue(updatedShift);
  
      const response = await request(app).post('/update').send(updatedShift);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Shift updated successfully', shift: updatedShift });
      expect(Shift.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: shiftId },
        { organization: updatedShift.organization, startTime: updatedShift.startTime, endTime: updatedShift.endTime, days: updatedShift.days, name: updatedShift.name, roles: updatedShift.roles },
        { new: true }
      );
    });
  
    it('should handle errors when updating a shift', async () => {
      const shiftId = 'shiftId';
      const updatedShift = { _id: shiftId, name: 'Updated Shift' };

      Shift.findOneAndUpdate.mockRejectedValue(new Error('Database error'));
  
      const response = await request(app).post('/update').send(updatedShift);
  
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: 'Error updating Shift' });
      expect(Shift.findOneAndUpdate).toHaveBeenCalled();
    });
  });
});
