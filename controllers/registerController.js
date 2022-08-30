const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  // check for missing all inputs
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password)
    return res
      .status(400)
      .json({ message: "fullname, email, and password are required." });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ email }).exec();
  if (duplicate)
    return res.status(409).json({ message: "User is already registred." }); //Conflict

  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // store the new user
    const result = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    console.log(result);

    res.status(201).json({ success: `New user <${result.fullname}> created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
