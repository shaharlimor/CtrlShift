const scheduleShifts = async (monthlyShifts, users, constraints) => {
  // Step 1: Create a list for each type containing all the shifts and for each shift a list of all the employees that can do that shift
  // Step 2: Sort all the lists by the amount of employees that can do that shift
  const shiftsByType = createShiftsAndEmployeesLists(
    monthlyShifts,
    users,
    constraints
  );

  // Step 3: Begin a loop to assign shifts to employees
  const assignedShifts = [];
  for (const shiftType of shiftsByType.values()) {
    for (const shift of shiftType.shifts) {
      // Step 3a: Take a shift from one of the types with the least employees that can do that shift

      const possibleEmployees = shiftType.employeesByShift.get(shift.shift._id);
      let assignedEmployee;

      if (!possibleEmployees || possibleEmployees.length === 0) {
        assignedEmployee = { id: null, weight: 0 };
        assignedShifts.push({ ...shift, assignedEmployee });
        continue;
      } else if (possibleEmployees.length === 1) {
        assignedEmployee = { id: possibleEmployees[0]._id, weight: 0 };
        assignedShifts.push({ ...shift, assignedEmployee });
        continue;
      } else {
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

  console.log(assignedShifts);
  return assignedShifts;
};

const createShiftsAndEmployeesLists = (monthlyShifts, users, constraints) => {
  const shiftsByType = new Map();

  for (const shift of monthlyShifts) {
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

// const assignShiftToEmployee = (shift, employeesByShift) => {
//   // implementation
//   return assignedEmployee;
// };

const updateEmployeeWeight = (users, employeeId, weightDelta) => {
  const employee = users.find((user) => user._id === employeeId);
  if (employee) {
    employee.weight += weightDelta;
  }
};
const removeShiftFromEmployee = (
  employee,
  shift,
  employeesByShift,
  constraints
) => {
  // Remove the shift from the employee's available shifts
  // console.log("employeesByShift", employeesByShift);
  // employeesByShift = employeesByShift.filter(
  //   (availableShift) => availableShift._id !== shift._id
  // );
  // Check if the employee has any shifts assigned within the previous 12 hours
  // const now = new Date();
  // const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
  // const hasShiftWithinTwelveHours = employee.shifts.some(
  //   (assignedShift) =>
  //     assignedShift.shift.startTime >= twelveHoursAgo &&
  //     assignedShift.shift.startTime <= now
  // );
  // // If the employee has a shift within the previous 12 hours, remove the current shift from their available shifts
  // if (hasShiftWithinTwelveHours) {
  //   employee.availableShifts = employee.availableShifts.filter(
  //     (availableShift) => availableShift._id !== shift._id
  //   );
  // }
};

const calculateWeightedEmployee = (possibleEmployees) => {
  let lowestWeightedEmployee = null;
  let lowestWeight = Number.MAX_VALUE;

  for (const employee of possibleEmployees) {
    const weight = calculateEmployeeWeight(employee);
    if (
      weight < lowestWeight ||
      (weight === lowestWeight &&
        employee.shiftCount < lowestWeightedEmployee.shiftCount)
    ) {
      lowestWeight = weight;
      lowestWeightedEmployee = employee;
    }
  }

  console.log("sagi3", lowestWeightedEmployee);
  return lowestWeightedEmployee;
};

const calculateEmployeeWeight = (employee) => {
  // let weight = employee.weight;
  // if (employee.shiftCount > 0) {
  //   weight /= employee.shiftCount;
  // }

  // console.log("weight", weight);
  return 1;
};

// const sortEmployeesByWeight = (employeesByShift, shiftId) => {
//   // implementation
// };

module.exports = {
  scheduleShifts,
};
