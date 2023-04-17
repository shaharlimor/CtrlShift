const User = require("../models/users");
const Common = require("../controllers/common");
const AWS = require('aws-sdk');
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    const { id, email, firstName, lastName, phone, password, 
            organization, isAdmin, role } = req.body;

    try {
        salt = await bcrypt.genSalt(10);
        encryptedPass = await bcrypt.hash(password, salt);

        const user = new User({
            _id: id,
            firstName: firstName,
            lastName: lastName,
            organization: organization,
            isAdmin:isAdmin,
            phone: phone,
            email: email,
            password: encryptedPass,
        });
    
        newUser = await user.save();

        res.status(200).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.
        status(500).json({ message: 'Error creating user details' });
    }
};

const getAllUsersByOrganization = async (req, res) => {
  try {
      const organization = req.query.organization;
      const users = await User.find({"organization":organization});
      res.status(200).json({ message: 'All users', users: users });
    } catch (error) {
        res.status(500).json({ message: 'Error getting all users' });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { email, firstName, lastName, phone } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { email, firstName, lastName, phone, },
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
        await User.findOneAndDelete(
            { _id: userId }
        );

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};


const uploadToS3 = async (file, filename) => {
    AWS.config.update({
        accessKeyId: 'AKIAZBVAEAOF7D4IGZ6H',
        secretAccessKey: '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',
        region: 'eu-central-1',
    });

    const s3 = new AWS.S3();
    const bucketName = 'controlshift-images';
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
                console.log(error)
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
};

const changeImage = async (req, res) => {
    const user = await Common.getUserByRT(req)
    const userId = user._id;
    const filename = userId + ".png"
    const file = req.file;

    try {
        const result = await uploadToS3(file, filename);
        res.status(200).json({ message: 'Image uploaded successfully', imageUrl: result.Location });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image' });
    }
};

module.exports = {
    createUser,
    deleteUser,
    updateUser,
    getAllUsersByOrganization,
    changeImage
};