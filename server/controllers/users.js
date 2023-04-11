const Users = require("../models/users");

const createUser = async (req, res) => {
  const { email, firstName, lastName, phone } = req.body;

  try {
      const newUser = await Users.create(
          {email, firstName, lastName, phone,},
          { new: true } // Return the user
      );

      res.status(200).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user details' });
    }   
};

const getAllUsersByOrganization = async (req, res) => {
  try {
      const organization = req.query.organization;
      const users = await Users.find({"organization":organization});
      res.status(200).json({ message: 'All users', users: users });
    } catch (error) {
        res.status(500).json({ message: 'Error getting all users' });
    }   
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { email, firstName, lastName, phone } = req.body;

  try {
      const updatedUser = await Users.findOneAndUpdate(
          { _id: userId },
          {email, firstName, lastName, phone,},
          { new: true } // Return the updated user
      );
  
      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }   
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
      await Users.findOneAndDelete(
          { _id: userId }
      );
  
      res.status(200).json({ message: 'User deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }   
};

module.exports = {
    createUser,
    deleteUser,
    updateUser,
    getAllUsersByOrganization
  };