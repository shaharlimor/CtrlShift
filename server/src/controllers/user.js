const User = require("../models/user");
const Common = require("./common");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  const {
    id,
    email,
    firstName,
    lastName,
    phone,
    password,
    organization,
    isAdmin,
    roles,
  } = req.body;

  try {
    // Check if user exists in DB
    const foundUser = await User.findOne({ email: email });
    if (foundUser != null) {
      return res.status(500).send("User already exists");
    }

    salt = await bcrypt.genSalt(10);
    encryptedPass = await bcrypt.hash(password, salt);

    const user = new User({
      _id: id,
      firstName: firstName,
      lastName: lastName,
      organization: organization,
      isAdmin: isAdmin,
      phone: phone,
      email: email,
      password: encryptedPass,
      role_types: roles,
    });

    newUser = await user.save();

    res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user details" });
  }
};

const getAllUsersByOrganization = async (req, res) => {
  try {
    const organization = req.query.organization;
    const users = await User.find({ organization: organization });
    res.status(200).json({ message: "All users", users: users });
  } catch (error) {
    res.status(500).json({ message: "Error getting all users" });
  }
};

const getEmployeesDetails = async (usersList) => {
  return await User.find(
    { _id: { $in: usersList } },
    { firstName: 1, lastName: 1 }
  );
};

const updateUser = async (req, res) => {
  const {
    id,
    email,
    firstName,
    lastName,
    phone,
    password,
    organization,
    isAdmin,
    roles,
    tokens,
  } = req.body;

  try {
    const user = new User({
      _id: id,
      firstName: firstName,
      lastName: lastName,
      organization: organization,
      isAdmin: isAdmin,
      phone: phone,
      email: email,
      password: password,
      role_types: roles,
      tokens: tokens,
    });

    newUser = await User.updateOne({ email: email }, user);

    res
      .status(200)
      .json({ message: "User updated successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error update user details" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await User.findOneAndDelete({ _id: userId });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

const uploadToS3 = async (file, filename) => {
  AWS.config.update({
    accessKeyId: "AKIAZBVAEAOF7D4IGZ6H",
    secretAccessKey: "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",
    region: "eu-central-1",
  });

  const s3 = new AWS.S3();
  const bucketName = "controlshift-images";
  const key = filename;

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (error, data) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

const changeImage = async (req, res) => {
  const user = await Common.getUserByRT(req);
  const userId = user._id;
  const filename = userId + ".png";
  const file = req.file;

  try {
    const result = await uploadToS3(file, filename);
    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.Location,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image" });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await Common.getUserByRT(req);
    const userId = user._id;
    const storedPassword = user.password;

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      storedPassword
    );

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password using bcrypt
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { password: hashedNewPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password" });
  }
};

module.exports = {
  createUser,
  deleteUser,
  updateUser,
  getAllUsersByOrganization,
  changeImage,
  changePassword,
  getEmployeesDetails,
};
