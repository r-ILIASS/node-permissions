const User = require("../model/User");
const cookiesOptions = require("../config/cookiesOptions");

const handleLogout = async (req, res) => {
  // ================ IMPORTANT NOTE =================
  // make sure to delete the accessToken on client too

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is user with refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { ...cookiesOptions });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result) // TODO: remove

  res.clearCookie("jwt", { ...cookiesOptions });
  res.sendStatus(204);
};

module.exports = { handleLogout };
