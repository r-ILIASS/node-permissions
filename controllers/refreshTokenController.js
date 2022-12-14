const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  // Get jwt from the cookie
  const cookies = req.cookies;
  console.log("cookies is: ", cookies); // TODO: remove in production
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  // Is user with refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden

  // Evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.status(403).json({message: "Invalid token"});

    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
