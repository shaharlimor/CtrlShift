const request = require("supertest");
const express = require("express");
const Constraint = require("../../src/models/constraints");
const middleware = require("../../src/common/auth_middleware");
const router = require("../../src/routes/constraints");

const {
    getConstraints,
    getConstraintsByShiftId,
    getConstraintsByEmployeeId,
    employeeHasConstraintInShift,
  } = require("../../src/controllers/constraints");
  
jest.mock("../../src/models/constraints");
jest.mock("../../src/controllers/constraints");

const app = express();
app.use(express.json());
app.use("/",middleware, router);

describe("Constraints Router", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /constraints/:organization", () => {
    it("should return constraints for the specified organization", async () => {
      const organization = "org1";
      const constraints = ["constraint1", "constraint2"];

      getConstraints.mockResolvedValue(constraints);

      const response = await request(app).get(`/${organization}`);
      expect(getConstraints).toHaveBeenCalledWith(organization);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(constraints);
    });

    it("should return an error if an error occurs", async () => {
      const organization = "org1";
      const error = "Error occurred";

      getConstraints.mockRejectedValue(error);

      const response = await request(app).get(`/${organization}`);

      expect(getConstraints).toHaveBeenCalledWith(organization);
      expect(response.status).toBe(200);
      expect(response.text).toEqual(`error occurred to get constraints: ${error}`);
    });
  });

  describe("GET /constraints/byShift/:id", () => {
    it("should return constraints for the specified shift ID", async () => {
      const id = "shift1";
      const constraints = ["constraint1", "constraint2"];

      getConstraintsByShiftId.mockResolvedValue(constraints);

      const response = await request(app).get(`/byShift/${id}`);

      expect(getConstraintsByShiftId).toHaveBeenCalledWith(id);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(constraints);
    });

    it("should return an error if an error occurs", async () => {
      const id = "shift1";
      const error = "Error occurred";

      getConstraintsByShiftId.mockRejectedValue(error);

      const response = await request(app).get(`/byShift/${id}`);

      expect(getConstraintsByShiftId).toHaveBeenCalledWith(id);
      expect(response.status).toBe(200);
      expect(response.text).toEqual(error);
    });
  });

  describe("GET /constraints/byEmployee/:id", () => {
    it("should return constraints for the specified employee ID", async () => {
      const id = "employee1";
      const constraints = ["constraint1", "constraint2"];

      getConstraintsByEmployeeId.mockResolvedValue(constraints);

      const response = await request(app).get(`/byEmployee/${id}`);

      expect(getConstraintsByEmployeeId).toHaveBeenCalledWith(id);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(constraints);
    });

    it("should return an error if an error occurs", async () => {
      const id = "employee1";
      const error = "Errsor occurred";

      getConstraintsByEmployeeId.mockRejectedValue(error);

      const response = await request(app).get(`/byEmployee/${id}`);

      expect(getConstraintsByEmployeeId).toHaveBeenCalledWith(id);
      expect(response.status).toBe(200);
      expect(response.text).toEqual(error);
    });
  });

  describe("GET /constraints/userHasConstraint/:employeeId/:shiftId", () => {
    it("should return the result of employeeHasConstraintInShift", async () => {
      const employeeId = "employee1";
      const shiftId = "shift1";
      const result = true;
      employeeHasConstraintInShift.mockResolvedValue(result);

      const response = await request(app).get(
        `/userHasConstraint/${employeeId}/${shiftId}`
      );

      expect(employeeHasConstraintInShift).toHaveBeenCalledWith(employeeId, shiftId);
      expect(response.status).toBe(200);
      expect(response.body).toBe(result);
    });

    it("should return an error if an error occurs", async () => {
      const employeeId = "employee1";
      const shiftId = "shift1";
      const error = "Error occurred";

      employeeHasConstraintInShift.mockRejectedValue(error);

      const response = await request(app).get(
        `/userHasConstraint/${employeeId}/${shiftId}`
      );

      expect(employeeHasConstraintInShift).toHaveBeenCalledWith(employeeId, shiftId);
      expect(response.status).toBe(200);
      expect(response.text).toEqual(error);
    });
  });

  describe("POST /constraints", () => {
    it("should add a new constraint", async () => {
      const constraintData = {
        level: "high",
        description: "Constraint description",
        shiftId: "shift1",
        employeeId: "employee1",
      };
      const savedConstraint = new Constraint(constraintData);

      Constraint.mockReturnValueOnce(savedConstraint);
      savedConstraint.save.mockResolvedValue(savedConstraint);

      const response = await request(app)
        .post("/")
        .send(constraintData);

      expect(Constraint).toHaveBeenCalledWith(constraintData);
      expect(savedConstraint.save).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.text).toEqual(
        "success adding new constraint" + JSON.stringify(savedConstraint)
      );
    });

    it("should return an error if an error occurs", async () => {
      const constraintData = {
        level: "high",
        description: "Constraint description",
        shiftId: "shift1",
        employeeId: "employee1",
      };
      const error = "Error occurred";

      Constraint.mockReturnValueOnce(new Constraint(constraintData));
      Constraint.prototype.save.mockRejectedValue(error);

      const response = await request(app)
        .post("/")
        .send(constraintData);

      expect(Constraint).toHaveBeenCalledWith(constraintData);
      expect(response.status).toBe(200);
      expect(response.text).toEqual(`error adding constraint. error: ${error}`);
    });
  });
});

