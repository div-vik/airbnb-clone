const jwt = require("jsonwebtoken");

const getUserDataFromReq = (req) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET,
      {},
      async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      }
    );
  });
};

module.exports = getUserDataFromReq;
