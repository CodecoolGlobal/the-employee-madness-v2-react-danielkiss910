require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const EmployeeModel = require("./db/employee.model");
const EquipmentModel = require("./db/equipment.model");
const FavoriteBrandModel = require("./db/favoriteBrand.model")
const ColourModel = require("./db/colours.model")
const ToolsModel = require("./db/tools.model");
const BoardGameModel = require("./db/boardGame.model");


const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();
app.use(express.json());



// ----- EMPLOYEES ----- //


// Fetch all employees
app.get("/api/employees/", async (req, res) => {
  try {
    const employees = await EmployeeModel.find()
      .populate("favoriteBrand") // Replace IDs with actual brand names, etc
      .populate("favouriteColour")
      .populate("favoriteTools")
      .populate("assignedEquipment")
      .populate("favoriteBoardGame")
      .sort({ created: "desc" }); // Sort in descending order of creation date

    return res.json(employees);
  } catch (error) {
    console.error("Error fetching employees", error);
    return res.status(500).json({ error: "Error fetching employees" });
  }
});


// Fetch employee by ID
app.get("/api/employees/:id", async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id)
    .populate("favoriteTools")
    .populate("assignedEquipment");
    return res.json(employee);
  } catch (error) {
    console.error("Error fetching employee by ID", error);
    return res.status(500).json({ error: "Error fetching employee by ID" });
  }
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

// Fetch top paid employees
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

// Fetch missing employees
app.get("/api/missing", async (req, res) => {
  try {
    const missingEmployees = await EmployeeModel.find({ present: false });
    return res.json(missingEmployees);
  } catch (error) {
    console.error("Error fetching missing employees", error);
    return res.status(500).json({ error: "Error fetching missing employees" });
  }
});


// Create new employee
app.post("/api/employees/", async (req, res, next) => {
  const employee = req.body;

  try {
    const saved = await EmployeeModel.create(employee);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

// Update multiple present employees
app.patch("/api/update-attendance", async (req, res, next) => {
  const { employeeIds } = req.body;
  try {
    await EmployeeModel.updateMany(
      { _id: { $in: employeeIds } },
      { $set: { present: true } }
    );
    return res.json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error("Error updating attendance", error);
    return res.status(500).json({ error: "Error updating attendance" });
  }
});


// Update single employee by ID
app.patch("/api/employees/:id", async (req, res, next) => {
  try {
    const { equipmentId, favoriteTools, ...employeeData } = req.body;
    // Check if equipmentId is provided and assign the equipment to the employee
    if (equipmentId) {
      await EmployeeModel.updateOne(
        { _id: req.params.id },
        { $set: { ...employeeData, assignedEquipment: equipmentId } }
      );
    } else {
      //If equipmentId is not provided, update other employee data
      await EmployeeModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { ...employeeData, assignedEquipment: null } }
      );
    }
    // Check same for favorite tools
    if (favoriteTools) {
      await EmployeeModel.updateOne(
        { _id: req.params.id },
        { $set: { ...employeeData, favoriteTools } }
      );
    } else {
      await EmployeeModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { ...employeeData } }
      );
    }
    const updatedEmployee = await EmployeeModel.findById(req.params.id);
    return res.json(updatedEmployee);

  } catch (err) {
    return next(err);
  }
});

// Delete single employee by ID
app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    const deleted = await employee.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});



// ----- EQUIPMENT ----- //


// Fetch all equipment
app.get("/api/equipment", async (req, res) => {
  try {
    const equipment = await EquipmentModel.find().sort({ created: "desc" });
    return res.json(equipment);
    } catch (error) {
    console.error("Error fetching equipment", error);
    return res.status(500).json({ error: "Error fetching equipment" });
  }
});

// Fetch single equipment by ID
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


// ----- FAVOURITE BRANDS ----- //

app.get("/api/favoritebrands", async (req, res) => {
  try {
    const favoriteBrands = await FavoriteBrandModel.find();
    res.json(favoriteBrands);
  } catch (error) {
    res.status(500).json({ error: "Error fetching favorite brands" })
  }
});


// ----- COLOURS ----- //

app.get("/api/colours", async (req, res) => {
  try {
    const savedColours = await ColourModel.find();
    return res.json(savedColours);
  } catch (error) {
    console.error("Error saving colours", error);
    return res.status(500).json({ error: "Error saving colours" });
  }
});


// ----- BOARD GAMES ----- //

// Fetch games
app.get("/api/games", async (req, res) => {
  try {
    const savedGames = await BoardGameModel.find();
    return res.json(savedGames);
  } catch (error) {
    console.error("Error saving games", error);
    return res.status(500).json({ error: "Error saving games" });
  }
});

// Create new game
app.post("/api/games", async (req, res, next) => {
  const game = req.body;

  try {
    const saved = await BoardGameModel.create(game);
    return res.json(saved);
  } catch (error) {
    return next(error);
  }
});


// ----- TOOLS -----//


// Fetch tools
app.get("/api/tools", async (req, res) => {
  try {
    const tools = await ToolsModel.find();
    return res.json(tools);
  } catch (error) {
    console.error("Error fetching tools", error);
    return res.status(500).json({ error: "Error fetching tools" });
  }
});

// Create new tools
app.post("/api/tools", async (req, res, next) => {
  const tool = req.body;

  try {
    const saved = await ToolsModel.create(tool);
    return res.json(saved);
  } catch (error) {
    return next(error);
  }
});

// Update tool by ID
app.patch("/api/tool/:id", async (req, res, next) => {
  try {
    const tool = await ToolsModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.json(tool);
  } catch (error) {
    return next(error);
  }
});

// Delete tool by ID
app.delete("api/tools/:id", async (req, res, next) => {
  try {
    const tool = await ToolsModel.findById(req.params.id);
    const deleted = await tool.delete();
    return res.json(deleted);
  } catch (error) {
    return next(error);
  }
});


// ----- KITTENS ----- //


// Fetch kittens by employee ID
app.get("/api/kittens/:employeeId", async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.employeeId);
    // Check if employee exists
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    // Return kittens associated with employee
    return res.json(employee.kittens)
  } catch (error) {
    console.error("Error fetching kittens for employee", error);
    return res.status(500).json({ error: "Error fetching kittens for employee" });
  }
});


// Add new kitten to employee
app.post("/api/kittens/:employeeId", async (req, res,) => {
  try {
    const employee = await EmployeeModel.findById(req.params.employeeId);
    // Check if employee exists
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    // Add kitten to kitten array of employee
    employee.kittens.push(req.body);
    await employee.save();

    return res.json(employee);
  } catch (error) {
    console.error("Error adding kitten to employee", error);
    return res.status(500).json({ error: "Error adding kitten to employee" });
  }
});


const main = async () => {
  await mongoose.connect(MONGO_URL);

  app.listen(PORT, () => {
    console.log("Server successfully started");
    console.log("App is listening on port:", PORT);
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
