const MonthlyShifts = require("../models/monthlyShifts");

const scheduleShifts = async (monthlyShifts, users, constraints) => {
  const createShiftObject = (shiftsArray, newShift) => {
    const shiftLength = newShift.possibleEmployees.length;
    const shiftIndex = shiftsArray.findIndex(shift => shift.length === shiftLength);

    if (shiftIndex === -1) {
      const newShiftGroup = {
        length: shiftLength,
        shifts: [newShift],
      };

      shiftsArray.push(newShiftGroup);
      shiftsArray.sort((a, b) => a.length - b.length);
    } else {
      const existingShiftGroup = shiftsArray[shiftIndex];
      existingShiftGroup.shifts.push(newShift);
      existingShiftGroup.shifts.sort((a, b) => a.startTime - b.startTime);
    }
  }

  const assignShiftToEmployee = async(shiftID, roleType, employeeID) => {
    if (employeeID == null) {
      console.log(`no user can do shift ${shiftID} in role ${roleType}`)
    } else {
      usersWeight.get(employeeID).given += 1;
      console.log(`user ${employeeID} can do shift ${shiftID} in role ${roleType}`)
      MonthlyShifts.findByIdAndUpdate(
        shiftID,
        { $addToSet: { 'roles.$[role].employeeIds': employeeID } },
        {
          arrayFilters: [{ 'role.roleType': roleType }],
          new: true,
          upsert: true,
        }
      )
        .exec()
        .then((updatedShift) => {
          console.log('Employee ID added successfully:', updatedShift);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  const chooseEmployee = (shift) => {
    if (shift.possibleEmployees.length == 1) {
      return shift.possibleEmployees[0]
    } else {
      shift.possibleEmployees.forEach(user => usersWeight.get(user._id).potential -= 1)

      return shift.possibleEmployees.reduce((min, user) => {
        const userWeight = usersWeight.get(user._id);
        let weight;
        if (userWeight.given > perfectAmount) {
          weight = userWeight.given + userWeight.potential/2 + 10*(userWeight.given - perfectAmount);
        } else {
          weight = userWeight.given + userWeight.potential/2;
        }
        return weight < min.weight ? { user, weight } : min;
      }, { user: null, weight: Infinity }).user;
    }
  }

  const createShiftsAndEmployeesLists = (monthlyShifts, users, constraints) => {
    const shifts = [];
    for (const shift of monthlyShifts) {
      for (const role of shift.roles) {
        for (let i = 0; i < role.amount; i++) {
          // TODO multiply by the shift amount (can push to array times the amount)
          const possibleEmployees = users.filter((user) => {
            const hasConstraint = constraints.some(
              (constraint) =>
                constraint.employeeId === user._id && constraint.shiftId === shift._id.toString()
            );
  
            if (hasConstraint) {
              return false;
            };
  
            if (user.role_types.includes(role.roleType)) {
              usersWeight.get(user._id).potential += 1;
              return true
            }
  
            return false;
          });
  
          const newShift = {
            shiftsID: shift._id,
            startTime: shift.startTime,
            endTime: shift.endTime,
            name: shift.name,
            roleType: role.roleType,
            possibleEmployees
          };
  
          createShiftObject(shifts, newShift)
        }
      }
    };

    return shifts;
  };

  // create user weight map
  const usersWeight = new Map();
  users.forEach(user => usersWeight.set(user._id, { given: 0, potential: 0 }))

  // Step 1: Create a list for each type containing all the shifts and for each shift a list of all the employees that can do that shift
  // Step 2: Sort all the lists by the amount of employees that can do that shift
  const shifts = createShiftsAndEmployeesLists(monthlyShifts, users, constraints);

  const totalLength = shifts.reduce((acc, curr) => acc + curr.shifts.length, 0);
  const perfectAmount = totalLength / users.length

  while (shifts.length != 0) {
    if (shifts[0].length == 0) {
      shifts[0].shifts.forEach(shift => {
        assignShiftToEmployee(shift.shiftsID, shift.roleType, null);
      });
      shifts.splice(0, 1);
    } else {
      const chosenEmployee = chooseEmployee(shifts[0].shifts[0]);
      assignShiftToEmployee(shifts[0].shifts[0].shiftsID, shifts[0].shifts[0].roleType, chosenEmployee._id);

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