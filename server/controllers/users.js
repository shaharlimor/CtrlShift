const Users = require("../models/users");

const createUser = async (req, res) => {
  const { email, firstName, lastName, phone } = req.body;

  try {
      const newUser = await User.create(
          {email, firstName, lastName, phone,},
          { new: true } // Return the user
      );

      res.status(200).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user details' });
    }   
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { email, firstName, lastName, phone } = req.body;

  try {
      const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          {email, firstName, lastName, phone,},
          { new: true } // Return the updated user object
      );
  
      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user details' });
    }   
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
      await User.findOneAndDelete(
          { _id: userId }
      );
  
      res.status(200).json({ message: 'User deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user details' });
    }   
};

module.exports = {
    createUser,
    deleteUser,
    updateUser
  };