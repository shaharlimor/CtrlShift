const ShiftRoles = require("../models/shiftRoles");


const getRoleTypes = async (req, res) => {
  try {
    const organization = req.params.orgId;
    const roles = await ShiftRoles.find(
      {organization: organization}
    );
    res.send(roles);
  } catch (err) {
    res.send("error occured to get roles: " + err);
  }
}

const createRole = async (req, res) => {
try {
    const newRole = new ShiftRoles(req.body);
    const result = await newRole.save();

    res.status(200).json({ message: 'role created successfully', role: newRole });

    } catch (error) {
        res.status(500).json({ message: 'Error creating role' });
    }   
};

const updateRole = async (req, res) => {
  const { _id, organization, roleType } = req.body;
  
  try {
      const updatedRole = await ShiftRoles.findOneAndUpdate(
          { _id: _id },
          { organization, roleType },
          { new: true } // Return the updated role
      );
  
      if (!updateRole) {
          return res.status(404).json({ message: 'role not found' });
      }

      res.status(200).json({ message: 'role updated successfully', role: updatedRole });
    } catch (error) {
        res.status(500).json({ message: 'Error updating role' });
    }   
};

const deleteRole = async (req, res) => {
  const roleId = req.body._id;
  try {
      await ShiftRoles.findOneAndDelete(
          { _id: roleId }
      );
  
      res.status(200).json({ message: 'Role deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting role' });
    }   
};

module.exports = {
  getRoleTypes,
  createRole,
  deleteRole,
  updateRole
};
