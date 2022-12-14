// TODO: -- trycatch all

const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees)
    return res.status(204).json({
      message: "No employees found!",
    });

  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname || !req?.body?.email) {
    return res.status(400).json({
      message: "firstname, lastname and email are required",
    });
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({
      message: "ID parameter is required",
    });
  }

  // Is employee in db?
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `There is no employee with the ID: ${req.body.id}` });
  }

  // Update employee data
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  const result = employee.save();

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Employee ID required" });
  }

  try {
    // Is employee in db?
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        message: `There is no employee with the ID: ${req.params.id}`,
      });
    }

    // Delete employee from db
    const result = await Employee.deleteOne({ _id: req.params.id });

    res.status(204);
  } catch (error) {
    console.error(error);
  }
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Employee ID required" });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `There is no employee with the ID: ${req.body.id}` });
  }

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
