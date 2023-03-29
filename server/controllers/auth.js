const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const test = require('dotenv').config()

/**
 * Logged on user and gennerates user token.
 */
const login = async (req, res, next) => {
    console.log("login");
    const email = req.body.email;
    const password = req.body.password;

    // Check if email and password valid
    if (email == null || password == null) {
        return res.status(500).send("bad email or password");
    }
    try {
        // Check if user exists in DB
        const user = await User.findOne({"email":email})
        if (user == null) {
            return res.status(500).send("bad email or password");
        }

        // Check if password match
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(500).send("bad email or password");
        }

        const accessToken = await jwt.sign(
            {'_id':user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: process.env.JWT_TOKEN_EXPIRATION}
        )

        const refreshToken = await jwt.sign(
            {'_id':user._id},
            process.env.REFRESH_TOKEN_SECRET
        )

        if(user.tokens == null) {
            user.tokens = [refreshToken];
        } else {
            user.tokens.push(refreshToken);
        }

        await user.save();

        res.status(200).send({
            "accessToken" : accessToken,
            "refreshToken" : refreshToken,
            "user" : user
        });
    } catch(err) {
        return res.status(500).send(err.message);
    }
};


/**
 * Register creates new user and gennerates user token.
 */
const register = async (req, res, next) => {
    console.log("register");
    const email = req.body.email;
    const password = req.body.password;

    // Check if email and password valid
    if (email == null || password == null) {
        return res.status(500).send("bad email or password");
    }
    try {
        // Check if user exists in DB
        const foundUser = await User.findOne({"email":email})
        if (foundUser != null) {
            return res.status(500).send("User already exists");
        }

        salt = await bcrypt.genSalt(10);
        encryptedPass = await bcrypt.hash(password, salt);

        const user = new User({
            "_id": req.body.id,
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "organization": req.body.organizationName,
            // "isAdmin":
            "email": email,
            "password": encryptedPass
        });

        newUser = await user.save();
        
        const accessToken = await jwt.sign(
            {'_id':newUser._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: process.env.JWT_TOKEN_EXPIRATION}
        )

        const refreshToken = await jwt.sign(
            {'_id':newUser._id},
            process.env.REFRESH_TOKEN_SECRET
        )

        newUser.tokens = [refreshToken];
        await newUser.save();

        res.status(200).send({
            "accessToken" : accessToken,
            "refreshToken" : refreshToken,
            "user": newUser
        });
    } catch(err) {
        return res.status(500).send("Registration fail: " + err.message);
    }
};

/**
 * Refresh token is used to generates new access token.
 * Refresh token can used once.
 * Reuse of refresh token blocks the user .
 */
const refreshToken = async (req, res, next) => {
    authHeaders = req.headers['refreshtoken'];
    const token = authHeaders && authHeaders.split(' ')[1];
    if (token == null) {
        return res.sendStatus('401');
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err,user) => {
        if (err) {
            return res.status(403).send(err.message);
        }
       
        const userId = user._id;
        try {
            user = await User.findById(userId);
            if (user == null) {
                return res.status(403).send('invalid request');
            }

            if (!user.tokens.includes(token)) {
                user.tokens = []; // Invalidate all user tokens
                await user.save();
                return res.status(403).send('invalid request'); 
            }

            const accessToken = await jwt.sign(
                {'_id':user._id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: process.env.JWT_TOKEN_EXPIRATION}
            )
    
            const refreshToken = await jwt.sign(
                {'_id':user._id},
                process.env.REFRESH_TOKEN_SECRET
            )

            // New refresh token
            user.tokens[user.tokens.indexOf(token)] = refreshToken;
            const newUser = await user.save();
            res.status(200).send({
                "accessToken" : accessToken,
                "refreshToken" : refreshToken,
                "user": newUser
            });
        } catch(err) {
            res.status(403).send(err.message);
        }
    })
};

/**
 * If token is valid then invalidate it
 * Else, invalidate all user tokens
 */
const logout = async (req, res, next) => {
    authHeaders = req.headers['refreshtoken'];
    const token = authHeaders && authHeaders.split(' ')[1];
    if (token == null) {
        return res.sendStatus('401');
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err,user) => {
        if (err) {
            return res.status(403).send(err.message);
        }
       
        const userId = user._id;
        try {
            user = await User.findById(userId);
            if (user == null) {
                return res.status(403).send('invalid request');
            }

            // Invalidate all tokens
            if (!user.tokens.includes(token)) {
                user.tokens = [];
                await user.save();
                return res.status(403).send('invalid request'); 
            }

            // Invalidate the specific token
            user.tokens.splice(user.tokens.indexOf(token), 1);
            await user.save();
            res.status(200).send();
        } catch(err) {
            res.status(403).send(err.message);
        }
    })
};

const getUserByRefreshToken = async (req, res, next) => {
    try {
        const refreshTokenHeader = req.headers['refreshtoken'];
        const refreshToken = refreshTokenHeader && refreshTokenHeader.split(' ')[1];
        const user = await User.findOne({"tokens":refreshToken});

        if (user == null) {
            return res.status(500).send("invalid token");
        } else {
            res.status(200).send({"user": user});
        }
    } catch(err) {
        return res.status(500).send("Get user by token fail: " + err.message);
    }
}

const updateUserDetails = async (req, res) => {
    authHeaders = req.headers['refreshtoken'];
    const token = authHeaders && authHeaders.split(' ')[1];
    if (token == null) {
        return res.sendStatus('401');
    }



    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err,user) => {
        if (err) {
            return res.status(403).send(err.message);
        }
       
        const userId = user._id;
        const { email, firstName, lastName, phone } = req.body;
        
  
        console.log(`updateUserDetails for user ${userId}`)

        try {
            // Find the user by ID and update the details
            const updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                {
                email,
                firstName,
                lastName,
                phone,
                },
                { new: true } // Return the updated user object
            );
        
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
        
            // Send the response back to the client
            res.status(200).json({ message: 'User details updated successfully', user: updatedUser });
        } catch (error) {
            console.error('Error updating user details:', error);
            res.status(500).json({ message: 'Error updating user details' });
        }
    })
  };

module.exports = {
    login,
    register,
    logout,
    refreshToken,
    getUserByRefreshToken,
    updateUserDetails
}
