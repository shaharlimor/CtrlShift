const scheduleShifts = async (monthlyShifts, users, constraints) => {
  // Step 1: Create a list for each type containing all the shifts and for each shift a list of all the employees that can do that shift
  // Step 2: Sort all the lists by the amount of employees that can do that shift
  const shiftsByType = createShiftsAndEmployeesLists(
    monthlyShifts,
    users,
    constraints
  );

  console.log("sagi", shiftsByType);

  // Sort each list of shifts by the number of employees that can do that shift
  sortListsByEmployeeCount(shiftsByType);

  // Step 3: Begin a loop to assign shifts to employees
  const assignedShifts = [];
  for (const shiftType of shiftsByType.values()) {
    for (const shift of shiftType.shifts) {
      // Step 3a: Take a shift from one of the types with the least employees that can do that shift
      const possibleEmployees = shiftType.employeesByShift.get(shift._id);
      let assignedEmployee;
      if (possibleEmployees.length === 0) {
        // If no employee is available, assign the shift to "null"
        assignedEmployee = { id: null, weight: 0 };
        assignedShifts.push({ ...shift, assignedEmployee });
        continue;
      } else if (possibleEmployees.length === 1) {
        // If only one employee is available, assign the shift to that employee
        assignedEmployee = { id: possibleEmployees[0]._id, weight: 0 };
        assignedShifts.push({ ...shift, assignedEmployee });
        continue;
      } else {
        // If multiple employees are available, calculate the weighted employee based on constraints
        assignedEmployee = calculateWeightedEmployee(possibleEmployees);
        assignedShifts.push({ ...shift, assignedEmployee });
      }

      // Step 3b: Update the employee's weight
      updateEmployeeWeight(users, assignedEmployee.id, assignedEmployee.weight);

      // Step 3c: Check constraints and remove shift from employee's available shifts
      removeShiftFromEmployee(
        assignedEmployee,
        shift,
        shiftType.employeesByShift,
        constraints
      );

      // Step 3d: Re-sort the list of employees that can do that shift by weight
      possibleEmployees.sort((a, b) => b.weight - a.weight);
    }
  }

  return assignedShifts;
};

const createShiftsAndEmployeesLists = (monthlyShifts, users, constraints) => {
  const shiftsByType = new Map();

  for (const shift of monthlyShifts) {
    console.log("shift", shift);
    const shiftType = shift.name;

    if (!shiftsByType.has(shiftType)) {
      shiftsByType.set(shiftType, { shifts: [], employeesByShift: new Map() });
    }

    const possibleEmployees = users.filter((user) => {
      const hasConstraint = constraints.some(
        (constraint) =>
          constraint.employeeId === user._id && constraint.shiftId === shift._id
      );

      if (hasConstraint) {
        return false;
      }

      console.log(user);
      const hasRoleType = shift.roles.some((role) =>
        user.role_types.includes(role.roleType)
      );

      if (!hasRoleType) {
        return false;
      }

      return true;
    });

    shiftsByType.get(shiftType).shifts.push({
      shift: shift,
      possibleEmployees: possibleEmployees,
    });
  }

  // Sort each shift by the number of employees that can do it
  for (const shiftType of shiftsByType.values()) {
    shiftType.shifts.sort((a, b) => {
      const numPossibleEmployeesA = a.possibleEmployees.length;
      const numPossibleEmployeesB = b.possibleEmployees.length;
      return numPossibleEmployeesA - numPossibleEmployeesB;
    });

    for (const shift of shiftType.shifts) {
      shiftType.employeesByShift.set(shift.shift._id, shift.possibleEmployees);
    }
  }

  return shiftsByType;
};

const sortListsByEmployeeCount = (shiftType) => {
  for (const [shiftId, possibleEmployees] of shiftType.employeesByShift) {
    possibleEmployees.sort((a, b) => a.canDoShiftCount - b.canDoShiftCount);
  }
};

const assignShiftToEmployee = (shift, employeesByShift) => {
  // implementation
  return assignedEmployee;
};

const updateEmployeeWeight = (users, employeeId, weightDelta) => {
  // implementation
};

const removeShiftFromEmployee = (
  employee,
  shift,
  employeesByShift,
  constraints
) => {
  // implementation
};

const sortEmployeesByWeight = (employeesByShift, shiftId) => {
  // implementation
};

module.exports = {
  scheduleShifts,
};
