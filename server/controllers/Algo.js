const MonthlyShifts = require("../models/monthlyShifts");

const createShiftObject = (shiftsArray, newShift) => {
  const shiftLength = newShift.possibleEmployees.length;
  const shiftIndex = shiftsArray.findIndex(
    (shift) => shift.length === shiftLength
  );

  if (shiftIndex === -1) {
    const newShiftGroup = {
      length: shiftLength,
      shifts: [newShift],
    };

    // Find the correct index to insert the newShiftGroup
    let insertIndex = shiftsArray.findIndex(
      (shift) => shift.length > shiftLength
    );
    if (insertIndex === -1) {
      insertIndex = shiftsArray.length; // Insert at the end if no longer shift found
    }

    shiftsArray.splice(insertIndex, 0, newShiftGroup);
  } else {
    const existingShiftGroup = shiftsArray[shiftIndex];
    const insertIndex = existingShiftGroup.shifts.findIndex(
      (shift) => shift.startTime > newShift.startTime
    );
    if (insertIndex === -1) {
      existingShiftGroup.shifts.push(newShift); // Insert at the end if no earlier shift found
    } else {
      existingShiftGroup.shifts.splice(insertIndex, 0, newShift); // Insert at the correct sorted position
    }
  }
};

const assignShiftToEmployee = async (shiftID, roleType, employeeID) => {
  if (employeeID == null) {
    // MonthlyShifts.findByIdAndUpdate(
    //   shiftID,
    //   { $addToSet: { 'roles.$[role].employeeIds': employeeID } },
    //   {
    //     arrayFilters: [{ 'role.roleType': roleType }],
    //     new: true,
    //     upsert: true,
    //   },
    //   (err) => {
    //     if (err) {
    //       console.error(err);
    //     }
    //   }
    // );
  } else {
    usersWeight.get(employeeID).given += 1;
    // MonthlyShifts.findByIdAndUpdate(
    //   shiftID,
    //   { $addToSet: { "roles.$[role].employeeIds": employeeID } },
    //   {
    //     arrayFilters: [{ "role.roleType": roleType }],
    //     new: true,
    //     upsert: true,
    //   },
    //   (err) => {
    //     if (err) {
    //       console.error(err);
    //     }
    //   }
    // );
    console.log("employeeID", employeeID);
    console.log(shiftID);
  }
};

const chooseEmployee = (shift) => {
  if (shift.possibleEmployees.length == 1) {
    return shift.possibleEmployees[0]._id;
  } else {
    shift.possibleEmployees.forEach(
      (user) => (usersWeight.get(user._id).potential -= 1)
    );

    return users.reduce(
      (min, user) => {
        const userWeight = usersWeight.get(user._id);
        const weight = userWeight.given + userWeight.potential / 2;
        return weight < min.weight ? { user, weight } : min;
      },
      { user: null, weight: Infinity }
    ).user;
  }
};

// TODO save available shifts for each user
const createShiftsAndEmployeesLists = (monthlyShifts, users, constraints) => {
  // TODO map for type to users (so it will be faster then going therow all the users)
  const shifts = [];
  for (const shift of monthlyShifts) {
    for (const role of shift.roles) {
      // TODO multiply by the shift amount (can push to array times the amount)
      const possibleEmployees = users.filter((user) => {
        const hasConstraint = constraints.some(
          (constraint) =>
            constraint.employeeId === user._id &&
            constraint.shiftId === shift._id
        );

        if (hasConstraint) {
          return false;
        }

        if (user.role_types.includes(role.roleType)) {
          usersWeight.get(user._id).potential += 1;
          return true;
        }

        return false;
      });

      const newShift = {
        shiftsID: shift._id,
        startTime: shift.startTime,
        endTime: shift.endTime,
        name: shift.name,
        roleType: role.roleType,
        possibleEmployees,
      };

      createShiftObject(shifts, newShift);
    }
  }

  return shifts;
};

const scheduleShifts = async (monthlyShifts, users, constraints) => {
  // create user weight map
  const usersWeight = new Map();
  users.forEach((user) =>
    usersWeight.set(user._id, { given: 0, potential: 0 })
  );

  // Step 1: Create a list for each type containing all the shifts and for each shift a list of all the employees that can do that shift
  // Step 2: Sort all the lists by the amount of employees that can do that shift
  const shifts = createShiftsAndEmployeesLists(
    monthlyShifts,
    users,
    constraints
  );

  while (shifts.length != 0) {
    if (shifts[0].length == 0) {
      shifts[0].shifts.forEach((shift) => {
        assignShiftToEmployee(shift.shiftsID, shift.roleType, null);
      });
      shifts.splice(0, 1);
    } else {
      const chosenEmployee = chooseEmployee(shifts[0].shifts[0]);
      assignShiftToEmployee(
        shifts[0].shifts[0],
        shifts.roleType,
        chosenEmployee._id
      );

      if (shifts[0].shifts.length > 1) {
        shifts[0].shifts.splice(0, 1);
      } else {
        shifts.splice(0, 1);
      }

      // find and resort the problem shifts
    }
  }
};

module.exports = {
  scheduleShifts,
};
