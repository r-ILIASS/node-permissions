const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// roles
const { Admin, Editor } = ROLES_LIST;

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(verifyRoles(Admin, Editor), employeesController.createNewEmployee)
  .put(verifyRoles(Admin, Editor), employeesController.updateEmployee);

router
  .route("/:id")
  .get(employeesController.getEmployee)
  .delete(verifyRoles(Admin), employeesController.deleteEmployee);

module.exports = router;
