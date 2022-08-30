const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      console.log("NO ROLES, UNAUTHORIZED!"); // TODO: remove in production
      return res.sendStatus(401);
    }

    const rolesArray = [...allowedRoles];

    console.log("ROLES ARRAY: ", rolesArray);
    console.log("REQ ROLES: ", req.roles);

    // compare roles
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);

    if (!result) return res.sendStatus(401);

    next();
  };
};

module.exports = verifyRoles;
