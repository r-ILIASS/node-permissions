const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookiesOptions = require("../config/cookiesOptions");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "email and password are required." });

  // Is user in db?
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  // Evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  // Is password correct?
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean); // .filter rule to eliminate null values in roles array
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result); // TODO: remove

    res.cookie("jwt", refreshToken, {
      ...cookiesOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, roles }); // TODO: roles
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
