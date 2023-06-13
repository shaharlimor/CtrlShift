const SwapRequest = require("../models/swapRequests");
const { getShiftById} = require("../controllers/monthlyShifts");
const User = require("../models/user");
const MonthlyShifts = require("../models/monthlyShifts");
const Notification = require("../models/notifications");

const getSwapRequestById = async (id) => {
  return await SwapRequest.find(
    { _id: id },
    "_id userId shiftId requestUserId requestShiftId status"
  );
};


const swapEmployeesInShift = async (req, res) => {
  const notificationId = req.body.notificationId;
  const notification = await Notification.findById(notificationId);
  MonthlyShifts.findById(notification.shiftId)
  .then((shift) => {
    if (!shift) {
      throw new Error('Shift not found');
    }

    // Modify the employeeIds
    shift.roles.forEach((role) => {
      const index = role.employeeIds.indexOf(notification.userId);
      if (index !== -1) {
        role.employeeIds[index] = notification.requestUserId;
      }
    });

    // Save the updated document
    return shift.save();
  })
  .then(() => {
    console.log('Shift updated');
  })
  .catch((error) => {
    console.error('Error updating shift:', error);
  });

  MonthlyShifts.findById(notification.requestShiftId)
  .then((shift) => {
    if (!shift) {
      throw new Error('Shift not found');
    }

    // Modify the employeeIds
    shift.roles.forEach((role) => {
      const index = role.employeeIds.indexOf(notification.requestUserId);
      console.log(index)
      if (index !== -1) {
        role.employeeIds[index] = notification.userId;
      }
    });

    // Save the updated document
    return shift.save();
  })
  .then(() => {
    console.log('Shift updated');
  })
  .catch((error) => {
    console.error('Error updating shift:', error);
  });
};

const createSwapRequest = async (req, res) => {
  const userId = req.body.userId;
  const currentUser = await User.findById(userId);
  const targetUserId = req.body.requestUserId;
  const targetUser = await User.findById(targetUserId);
  const shiftId = req.body.shiftId;
  const shift = await MonthlyShifts.findById(shiftId);
  const requestShiftId = req.body.requestShiftId;
  const requestShift = await MonthlyShifts.findById(requestShiftId);

  if (!targetUser) {
    return res.status(404).send("Target user not found");
  }

  if (currentUser.organization !== targetUser.organization) {
    return res.status(403).send("Users are not in the same organization");
  }

  if (!shift) {
    return res.status(404).send("Target shift not found");
  }

  if (!requestShift) {
    return res.status(404).send("Requested shift not found");
  }

  const shiftFormattedDate = shift.startTime.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
  
  const shiftFormattedTime = shift.startTime.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  const shiftDate = `${shiftFormattedDate} ${shiftFormattedTime}`;

  const requestShiftFormattedDate = requestShift.startTime.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
  
  const requestShiftFormattedTime = requestShift.startTime.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  const requestShiftDate = `${requestShiftFormattedDate} ${requestShiftFormattedTime}`;

  const switchNotification = {
    userId: targetUserId,
    fromId: userId,
    message: `<b>${currentUser.firstName} ${currentUser.lastName}</b> proposed a shift change between <b>${shift.name} at ${shiftDate}</b> to <b>${requestShift.name} at ${requestShiftDate}</b>`,
    type: "switch",
    shiftId: shiftId,
    requestUserId: requestShiftId,
    requestShiftId: requestShiftId,
  };

  try {
    const savedNotification = await Notification.create(switchNotification);
    return res.json(savedNotification);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  createSwapRequest,
  swapEmployeesInShift,
  getSwapRequestById
};