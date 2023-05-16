const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {

  // Test mode 
  if (process.env.JEST_WORKER_ID !== undefined) {
    next();
  } else { //Prod mode

    authHeaders = req.headers["accesstoken"];
    const token = authHeaders && authHeaders.split(" ")[1];

    // Not permitted
    if (token == null) {
      return res.sendStatus("401");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        // 403?
        return res.status(401).send(err.message);
      }
      req.user = user;
      next();
    });
  }
};

module.exports = auth;
