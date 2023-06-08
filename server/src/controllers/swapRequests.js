const SwapRequest = require("../models/swapRequests");
const { getShiftById} = require("../controllers/monthlyShifts");
const User = require("../models/user");
const MonthlyShifts = require("../models/monthlyShifts");
const Notification = require("../models/notifications");
const constraints = require("../models/constraints");

const getSwapRequestById = async (id) => {
    return await SwapRequest.find(
      { _id: id },
      "_id userId shiftId requestUserId requestShiftId status"
    );
  };


const swapEmployeesInShift = async (req, res) => {
    try {
        const swapRequest = await getSwapRequestById(req.body.swapRequestId);
        const shift = await getShiftById(swapRequest.shiftId);
        const requestShift = await getShiftById(swapRequest.requestShiftId);
        if (!swapRequest || !swapRequest.length) res.status(500).json({ message: 'request swap request not found' });
        
        const swapDocument = swapRequest[0]; // access the first document in the array
        const shiftDocument= shift[0];
        const requestShiftDocument = requestShift[0];

        let isAlreadySwapped = true;
        shiftDocument?.roles.forEach((oldRole) => {
            if(oldRole.employeeIds.includes(swapRequest.userId)) isAlreadySwapped = false;
        });
        if (!shiftDocument || isAlreadySwapped ) res.status(500).json({ message: 'shift is already swapped' });;

        shiftDocument.roles = shiftDocument.roles.map((oldRole) => {
          const newRole = shiftDocument.roles.find((role) => role.employeeIds.includes(swapRequest.userId));
          const employeeIds = newRole?.employeeIds.filter((id) => id !== swapDocument.userId).push(swapDocument.requestUserId);
          return newRole ? { ...oldRole, employeeIds: employeeIds } : oldRole;
        });
        requestShiftDocument.roles = requestShiftDocument.roles.map((oldRole) => {
            const newRole = requestShiftDocument.roles.find((role) => role.employeeIds.includes(swapRequest.requestUserId));
            const employeeIds = newRole?.employeeIds.filter((id) => id !== swapDocument.requestUserId).push(swapDocument.userId);
            return newRole ? { ...oldRole, employeeIds: employeeIds } : oldRole;
          });
        await shiftDocument.save();
        await requestShiftDocument.save();
        swapDocument.status = 'approved';
        await swapDocument.save();
        res.status(200).json({ message: 'Success switching shifts'});
    } catch(error) {
        res.status(500).json({ message: 'Error switching shifts' });
    }
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
      switchID: requestShiftId,
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