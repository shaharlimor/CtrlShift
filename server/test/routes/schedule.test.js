const request = require("supertest");
const express = require("express");
const app = express();
const Schedule = require("../../src/models/schedule");
const {
  getSchedules,
  changeOpenToConstraints,
  boardOpenToConstraints,
  changePublish,
  isEmployeesAssigned,
} = require("../../src/controllers/schedule");

jest.mock("../../src/controllers/schedule");

const mockSchedule = {
  organization: "exampleOrg",
  month: 5,
  year: 2023,
  isPublished: false,
  isOpenToConstraints: true,
  employessAssigned: false,
};

app.use(express.json());
app.use("/", require("../../src/routes/schedule"));

describe("Schedule Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /", () => {
    it("should get schedules", async () => {
      // Mock the implementation of `getSchedules` controller
      getSchedules.mockResolvedValueOnce([mockSchedule]);

      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockSchedule]);
    });

    it("should handle errors when getting schedules", async () => {
      // Mock the implementation of `getSchedules` controller to throw an error
      getSchedules.mockRejectedValueOnce("Error getting schedules");

      const response = await request(app).get("/");
      expect(response.text).toBe(
        "error occured to get schedules: Error getting schedules"
      );
    });
  });

  describe("POST /", () => {
    it("should add a new schedule", async () => {
      Schedule.prototype.save = jest.fn().mockResolvedValueOnce(mockSchedule);

      const response = await request(app).post("/").send(mockSchedule);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(mockSchedule);
    });

    it("should handle errors when adding a new schedule", async () => {
      Schedule.prototype.save = jest
        .fn()
        .mockRejectedValueOnce("Error adding new schedule");

      const response = await request(app).post("/").send(mockSchedule);
      expect(response.text).toBe(
        "error adding new schedule. error: Error adding new schedule"
      );
    });
  });

  describe("PATCH /startInsertConstraints/", () => {
    it("should change open to constraints", async () => {
      // Mock the implementation of `changeOpenToConstraints` controller
      changeOpenToConstraints.mockResolvedValueOnce(
        "Open changed to constraints"
      );

      const requestBody = {
        organization: "exampleOrg",
        month: "exampleMonth",
        year: "exampleYear",
      };

      const response = await request(app)
        .patch("/startInsertConstraints/")
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(response.text).toBe("Open changed to constraints");
    });

    it("should handle errors when changing open to constraints", async () => {
      // Mock the implementation of `changeOpenToConstraints` controller to throw an error
      changeOpenToConstraints.mockRejectedValueOnce(
        "Error changing open to constraints"
      );

      const requestBody = {
        organization: "exampleOrg",
        month: "exampleMonth",
        year: "exampleYear",
      };

      const response = await request(app)
        .patch("/startInsertConstraints/")
        .send(requestBody);

      expect(response.text).toBe(
        "change start insert constraint failed. error: Error changing open to constraints"
      );
    });
  });

  describe("PATCH /publishBoard/", () => {
    it("should change publish", async () => {
      // Mock the implementation of `changePublish` controller
      changePublish.mockResolvedValueOnce("Publish changed");

      const requestBody = {
        organization: "exampleOrg",
        month: "exampleMonth",
        year: "exampleYear",
      };

      const response = await request(app)
        .patch("/publishBoard/")
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(response.text).toBe("Publish changed");
    });

    it("should handle errors when changing publish", async () => {
      changePublish.mockRejectedValueOnce("Error changing publish");

      const requestBody = {
        organization: "exampleOrg",
        month: "exampleMonth",
        year: "exampleYear",
      };

      const response = await request(app)
        .patch("/publishBoard/")
        .send(requestBody);

      // expect(response.status).toBe(500);
      expect(response.text).toBe(
        "Publish board failed. error: Error changing publish"
      );
    });
  });

  describe("GET /openToConstraints", () => {
    it("should check if board is open to insert constraints", async () => {
      boardOpenToConstraints.mockResolvedValueOnce(true);

      const requestBody = {
        organization: "exampleOrg",
        month: "exampleMonth",
        year: "exampleYear",
      };

      const response = await request(app)
        .get("/openToConstraints")
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toBe(true);
    });

    it("should handle errors when checking if board is open to insert constraints", async () => {
      // Mock the implementation of `boardOpenToConstraints` controller to throw an error
      boardOpenToConstraints.mockRejectedValueOnce(
        "Error checking if board is open to insert constraints"
      );

      const requestBody = {
        organization: "exampleOrg",
        month: "exampleMonth",
        year: "exampleYear",
      };

      const response = await request(app)
        .get("/openToConstraints")
        .send(requestBody);
      expect(response.text).toBe(
        "error to check if board open to insert constraints: Error checking if board is open to insert constraints"
      );
    });
  });

  describe("GET /employessAssigned", () => {
    it("should check if placment board for pspecifc month generated", async () => {
      isEmployeesAssigned.mockResolvedValueOnce(true);

      const requestBody = {
        organization: "exampleOrg",
        month: "exampleMonth",
        year: "exampleYear",
      };

      const response = await request(app)
        .get("/employeesAssigned")
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toBe(true);
    });

    it("should handle errors when checking if board is open to insert constraints", async () => {
      isEmployeesAssigned.mockRejectedValueOnce(
        "error to check if is employees assigned"
      );

      const requestBody = {
        organization: "exampleOrg",
        month: "exampleMonth",
        year: "exampleYear",
      };

      const response = await request(app)
        .get("/employeesAssigned")
        .send(requestBody);
      expect(response.text).toBe(
        "error to check if employees are assigned: error to check if is employees assigned"
      );
    });
  });
});
