const authController = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const bcryptSalt = bcrypt.genSaltSync(10);

authController.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

authController.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passsOk = bcrypt.compareSync(password, userDoc.password);
    if (passsOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) throw error;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("password not ok!");
    }
  } else {
    res.json("not found!");
  }
});

authController.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
      if (error) throw error;
      const userDoc = await User.findById(userData.id);
      const { password, ...others } = userDoc._doc;
      res.json(others);
    });
  } else {
    res.json(null);
  }
});

authController.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

module.exports = authController;
