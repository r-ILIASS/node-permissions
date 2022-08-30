const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      console.log("** NO ROLES PROVIDED, UNAUTHORIZED!"); // TODO: remove in production
      return res.sendStatus(401);
    }

    const rolesArray = [...allowedRoles];

    console.log("ROLES ARRAY: ", rolesArray);
    console.log("REQ ROLES: ", req.roles);

    // compare roles and find one "true" value
    const result = req.roles
      .map((role) => rolesArray.includes(role)) // ex: [true, false, false]
      .find((val) => val === true); // finds one true value
    if (!result) {
      console.log("** YOU DON'T HAVE THE ROLE TO DO THIS ACTION!"); // TODO: remove in prodoction
      return res.sendStatus(401);
    }

    console.log("PERMISSION APPROVED");

    next();
  };
};

module.exports = verifyRoles;
