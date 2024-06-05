require("dotenv").config(); // Load environment variables
const express = require("express"); // Express framework
const mongoose = require("mongoose"); // MongoDB handling
const EmployeeModel = require("./db/employee.model"); // Employee data model
const EquipmentModel = require("./db/equipment.model"); // Equipment data model

// Environment variables setup
const { MONGO_URL, PORT = 8080 } = process.env;

// Check for MongoDB URL
if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

// Initialize Express application
const app = express();
app.use(express.json()); // Handle JSON data

// Employee routes

// Get all employees
app.get("/api/employees/", async (req, res, next) => {
  try {
    const employees = await EmployeeModel.find().sort({ created: "desc" });
    return res.json(employees);
  } catch (error) {
    return next(error);
  }
});

// Get a single employee by ID
app.get("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    return res.json(employee);
  } catch (error) {
    return next(error);
  }
});

// Search for employees by a search query
app.get("/api/employees/search/:search", async (req, res, next) => {
  try {
    const searchQuery = req.params.search;
    const matchingEmployees = await EmployeeModel.find({
      $or: [
        { firstName: { $regex: searchQuery, $options: "i" } },
        { middleName: { $regex: searchQuery, $options: "i" } },
        { lastName: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ created: "desc" });

    return res.json(matchingEmployees);
  } catch (error) {
    return next(error);
  }
});

// Get missing employees
app.get("/api/missing", async (req, res, next) => {
  try {
    const missingEmployees = await EmployeeModel.find({ isPicked: false });
    return res.json(missingEmployees);
  } catch (error) {
    return next(error);
  }
});

// Create a new employee
app.post("/api/employees/", async (req, res, next) => {
  const employee = req.body;

  try {
    employee.isPicked = false; // Default value is false (not missing)
    const saved = await EmployeeModel.create(employee);
    return res.json(saved);
  } catch (error) {
    return next(error);
  }
});

// Update an employee by ID
app.patch("/api/employees/:id", async (req, res, next) => {
  try {
    if (req.body.isPicked === undefined) {
      req.body.isPicked = false;
    }

    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    return res.json(employee);
  } catch (error) {
    return next(error);
  }
});

// Delete an employee by ID
app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    const deleted = await employee.delete();
    return res.json(deleted);
  } catch (error) {
    return next(error);
  }
});

// Equipment routes

// Get all equipment
app.get("/api/equipment", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.find().sort({ created: "desc" });
    return res.json(equipment);
  } catch (error) {
    return next(error);
  }
});

// Get a single equipment by ID
app.get("/api/equipment/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findById(req.params.id);
    return res.json(equipment);
  } catch (error) {
    return next(error);
  }
});

// Create a new equipment
app.post("/api/equipment/", async (req, res, next) => {
  const equipment = req.body;

  try {
    const saved = await EquipmentModel.create(equipment);
    return res.json(saved);
  } catch (error) {
    return next(error);
  }
});

// Update equipment by ID
app.patch("/api/equipment/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    return res.json(equipment);
  } catch (error) {
    return next(error);
  }
});

// Delete equipment by ID
app.delete("/api/equipment/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findById(req.params.id);
    const deleted = await equipment.delete();
    return res.json(deleted);
  } catch (error) {
    return next(error);
  }
});

// Dashboard route
app.get("/api/dashboard", async (req, res, next) => {
  try {
    const totalEmployees = await EmployeeModel.countDocuments();
    
    const positionDistribution = await EmployeeModel.aggregate([
      { $group: { _id: "$position", count: { $sum: 1 } } }
    ]);

    const levelDistribution = await EmployeeModel.aggregate([
      { $group: { _id: "$level", count: { $sum: 1 } } }
    ]);

    const recentlyAddedEmployees = await EmployeeModel.find().sort({ created: -1 }).limit(5);

    const dashboardData = {
      totalEmployees,
      positions: positionDistribution.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {}),
      levels: levelDistribution.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {}),
      recentlyAddedEmployees: recentlyAddedEmployees.map(employee => ({ id: employee._id, name: `${employee.firstName} ${employee.lastName}`, position: employee.position }))
    };

    res.json(dashboardData);
  } catch (error) {
    next(error);
  }
});


// Main function to start the server
const main = async () => {
  try {
    await mongoose.connect(MONGO_URL); // Establish MongoDB connection
    app.listen(PORT, () => {
      console.log(`App is listening on ${PORT}`);
      console.log("Try /api/employees route right now");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
