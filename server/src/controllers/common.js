const User = require("../models/user");

const getUserByRT = async (req) => {
    const authHeaders = req.headers['refreshtoken'];
    const token = authHeaders && authHeaders.split(' ')[1];
    if (token == null) {
        return null;
    }

    const user = await User.findOne({ tokens: token });

    return user
}

module.exports = {
    getUserByRT,
};