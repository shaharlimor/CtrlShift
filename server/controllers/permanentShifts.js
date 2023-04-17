const Shift = require("../models/permanentShifts");


const getShifts = async (req, res) => {
  try {
    const organization = req.params.orgId;
    const shifts = await Shift.find(
      {organization: organization}
    );
    res.send(shifts);
  } catch (err) {
    res.send("error occured to get shifts: " + err);
  }
}

const createPermanentShift = async (req, res) => {
try {
    const newShift = new Shift(req.body);
    console.log(req.body);
    console.log(newShift);
    const result = await newShift.save();

    res.status(200).json({ message: 'Shift created successfully', shift: newShift });

    } catch (error) {
        res.status(500).json({ message: 'Error creating shift' });
    }   
};

const updatePermanentShift = async (req, res) => {
  const { _id ,organization, startTime, endTime, days, name, roles } = req.body;

  try {
      const updatedShift = await Shift.findOneAndUpdate(
          { _id: _id },
          { organization, startTime, endTime, days, name, roles },
          { new: true } // Return the updated shift
      );
  
      if (!updatedShift) {
          return res.status(404).json({ message: 'Shift not found' });
      }

      res.status(200).json({ message: 'Shift updated successfully', shift: updatedShift });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Shift' });
    }   
};

const deletePermanentShift = async (req, res) => {
  const shiftId = req.body.id;

  try {
      await Shift.findOneAndDelete(
          { _id: shiftId }
      );
  
      res.status(200).json({ message: 'Shift deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting shift' });
    }   
};

module.exports = {
  getShifts,
  createPermanentShift,
  deletePermanentShift,
  updatePermanentShift

};
