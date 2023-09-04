require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const EmployeeModel = require("./db/employee.model");
const EquipmentModel = require("./db/equipment.model");
const employeeModel = require("./db/employee.model");

const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();
app.use(express.json());


// Employees

app.get("/api/employees/", async (req, res) => {
  const employees = await EmployeeModel.find().sort({ created: "desc" });
  return res.json(employees);
});

// Fetch an employee by ID
app.get("/api/employees/:id", async (req, res) => {
  const employee = await EmployeeModel.findById(req.params.id);
  return res.json(employee);
});

// Fetch employees by search query
app.get("/api/search/:employeeSearch", async (req, res) => {
  const employeeSearch = req.params.employeeSearch;
  console.log("Received server side search query:", employeeSearch);

  try {
    const employees = await EmployeeModel.find({
      $or: [
        { firstName: { $regex: new RegExp(employeeSearch, "i") } },
        { middleName: { $regex: new RegExp(employeeSearch, "i") } },
        { lastName: { $regex: new RegExp(employeeSearch, "i") } }
      ]
    }).sort({ created: "desc" });

    return res.json(employees);
  } catch (error) {
    console.error("Error fetching search results", error);
    return res.status(500).json({ error: "Error fetching search results" });
  }
});

const colours = ["Black", "Grey", "Red", "Blue", "Orange", "White", "Brown", "Pink", "Yellow", "Green", "Purple", "Maroon", "Turquoise", "Cyan", "Gold", "Teal", "Lime", "Salmon", "Olive", "Aqua", "Violet"];
app.get(`/api/colours`, (req, res) => {
  res.json(colours);
});

app.get("/api/top-paid", async (req, res) => {
  try {
    const topPaidEmployees = await EmployeeModel.find()
    .sort({ currentSalary: -1 }) // Sort in descending order of salary
    .limit(3); // Limit to top 3 employees
    
    return res.json(topPaidEmployees);
  } catch (error) {
    console.error("Error fetching top paid employees", error);
    return res.status(500).json({ error: "Error fetching top paid employees" });
  }
});

app.get("/api/missing", async (req, res) => {
  try {
    const missingEmployees = await EmployeeModel.find({ present: false });
    return res.json(missingEmployees);
  } catch (error) {
    console.error("Error fetching missing employees", error);
    return res.status(500).json({ error: "Error fetching missing employees" });
  }
});

app.post("/api/employees/", async (req, res, next) => {
  const employee = req.body;

  try {
    const saved = await EmployeeModel.create(employee);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/update-attendance", async (req, res, next) => {
  const { employeeIds } = req.body;
  try {
    await employeeModel.updateMany(
      { _id: { $in: employeeIds } },
      { $set: { present: true } }
    );
    return res.json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error("Error updating attendance", error);
    return res.status(500).json({ error: "Error updating attendance" });
  }
});

app.patch("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.json(employee);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    const deleted = await employee.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

// Equipment

// Fetch all equipment
app.get("/api/equipment", async (req, res) => {
  const equipment = await EquipmentModel.find().sort({ created: "desc" });
  return res.json(equipment);
});

// Fetch a single equipment by ID
app.get("/api/equipment/:id", async (req, res) => {
  const equipment = await EquipmentModel.findById(req.params.id);
  return res.json(equipment);
});

// Create new equipment
app.post("/api/equipment/", async (req, res, next) => {
  const equipment = req.body;

  try {
    const saved = await EquipmentModel.create(equipment);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

// Update equipment bt ID
app.patch("/api/equipment/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.json(equipment);
  } catch (err) {
    return next(err);
  }
});

// Delete equipment by ID
app.delete("/api/equipment/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findById(req.params.id);
    const deleted = await equipment.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

const main = async () => {
  await mongoose.connect(MONGO_URL);

  app.listen(PORT, () => {
    console.log("App is listening on 8080");
    console.log("Try /api/employees route right now");
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

module.exports = colours;