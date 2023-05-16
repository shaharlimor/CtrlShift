const request = require('supertest');
const express = require('express');
const router = require("../../src/routes/monthlyShifts");
const Shift = require('../../src/models/monthlyShifts');
const {
  getShifts,
  getBoardListOfMonthlyShift,
  createMonthlyShiftBoard,
  deleteShiftById,
  getShiftsOpenToConstraints,
  getShiftsOpenToConstraintsByRoles,
  getShiftsPublished,
  changeEmployeesInShift,
  getShiftById,
} = require('../../src/controllers/monthlyShifts');

jest.mock('../../src/models/monthlyShifts');
jest.mock("../../src/controllers/monthlyShifts");

const app = express();
app.use(express.json());
app.use('/', router);

describe('Your Route Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should get shifts by organization', async () => {
    const organization = 'org';
    const shifts = ["shift1", "shift2"]; // Your expected shifts response
    getShifts.mockResolvedValue(shifts);
    const response = await request(app).get(`/${organization}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(shifts);
    expect(getShifts).toHaveBeenCalledWith(organization);
  });

  it('should get monthly shift board list by organization', async () => {
    const organization = 'yourOrganization';
    const MonthAndYearList = [{}, {}]; // Your expected MonthAndYearList response
    getBoardListOfMonthlyShift.mockResolvedValue(MonthAndYearList);
    const response = await request(app).get(`/monthOpendToAddShiftsList/${organization}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(MonthAndYearList);
    expect(getBoardListOfMonthlyShift).toHaveBeenCalledWith(organization);
  });

  it('should create a new monthly shift', async () => {
    const shift = { name: 'New Shift' };
    const newShift = new Shift(shift);
    const savedShift = { _id: 'shiftId', ...shift };
    newShift.save.mockResolvedValue(savedShift);
    const response = await request(app).post('/').send(shift);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`success adding new monthly shift${savedShift}`);
    expect(newShift.save).toHaveBeenCalled();
  });

  it('should create monthly shift board', async () => {
    const shifts = ["shift1", "shift2"];
    createMonthlyShiftBoard.mockResolvedValue(shifts);
    const response = await request(app).post('/createMonthlyShiftBoard').send({});
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(shifts);
    expect(createMonthlyShiftBoard).toHaveBeenCalled();
  });

  it('should delete a shift by ID', async () => {
    const shiftId = 'yourShiftID';
    deleteShiftById.mockResolvedValue();
    const response = await request(app).delete(`/${shiftId}`);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`success deleted shift ${shiftId}`);
    expect(deleteShiftById).toHaveBeenCalledWith(shiftId);
  });

  it('should get published shifts by organization', async () => {
    const organization = 'yourOrganization';
    const shifts = ["shift1", "shift2"]; // Your expected shifts response
    getShiftsPublished.mockResolvedValue(shifts);
    const response = await request(app).get(`/published/${organization}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(shifts);
    expect(getShiftsPublished).toHaveBeenCalledWith(organization);
  });

  it('should get shifts open to constraints by organization', async () => {
    const organization = 'yourOrganization';
    const shifts = ["shift1", 'shift2']; // Your expected shifts response
    getShiftsOpenToConstraints.mockResolvedValue(shifts);
    const response = await request(app).get(`/openToConstraints/${organization}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(shifts);
    expect(getShiftsOpenToConstraints).toHaveBeenCalledWith(organization);
  });

  it('should get shifts open to constraints by organization and role types', async () => {
    const organization = 'yourOrganization';
    const roleTypes = 'role1,role2'; // Your role types
    const shifts = ["shift1", "shift2"]; // Your expected shifts response
    getShiftsOpenToConstraintsByRoles.mockResolvedValue(shifts);
    const response = await request(app).get(`/openToConstraintsByRoles/${organization}/${roleTypes}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(shifts);
    expect(getShiftsOpenToConstraintsByRoles).toHaveBeenCalledWith(organization, roleTypes);
  });

  it('should get a shift by ID', async () => {
    const shiftId = 'yourShiftID';
    const shift = {}; // Your expected shift response
    getShiftById.mockResolvedValue(shift);
    const response = await request(app).get(`/byId/${shiftId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(shift);
    expect(getShiftById).toHaveBeenCalledWith(shiftId);
  });

  it('should assign employees to a shift', async () => {
    const shiftId = 'yourShiftID';
    const roles = [{ roleType: 'role1', employeeIds: ['employee1'] }]; // Your request body
    const result = 'Assignment successful'; // Your expected result
    changeEmployeesInShift.mockResolvedValue(result);
    
    const response = await request(app)
      .patch(`/assingEmployees/${shiftId}`)
      .send({ roles: roles }); // Pass the roles object as the request payload

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(result);
    expect(changeEmployeesInShift).toHaveBeenCalledWith(shiftId, roles);
  });
});

