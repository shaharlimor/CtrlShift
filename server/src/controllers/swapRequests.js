const SwapRequest = require("../models/swapRequests");
const { getShiftById} = require("../controllers/monthlyShifts");

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
    try {
        const swapRequest = new swapRequest({
            userId: req.body.userId,
            shiftId : req.body.shiftId,
            requestShiftId: req.body.requestShiftId,
            requestUserId: req.body.requestUserId,
            status: 'requested'
        });
        await swapRequest.save();
        // TODO: Call switch notification 
        res.status(200).json({ message: 'created swap request successfully', swapRequest: swapRequest });
    } catch(error) {
        res.status(500).json({ message: 'Error creating wap request' });
    }
  };

  module.exports = {
    createSwapRequest,
    swapEmployeesInShift,
    getSwapRequestById
      };