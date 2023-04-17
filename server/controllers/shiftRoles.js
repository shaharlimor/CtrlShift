const shiftRoles = require("../models/shiftRoles");

const getRolesByOrganization = async (req, res) => {
    try {
        const org = req.query.organization;
        const roles = await shiftRoles.find({"organization":org});
        res.status(200).json({ message: 'All roles', roles: roles });
      } catch (error) {
          res.status(500).json({ message: 'Error getting all roles' });
      }
};

module.exports = {
    getRolesByOrganization
};