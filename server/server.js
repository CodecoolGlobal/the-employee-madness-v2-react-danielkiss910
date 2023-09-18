// Load environment variables from .env file
require("dotenv").config();

// Import required libraries and modules
const express = require("express");
const mongoose = require("mongoose");
const EmployeeModel = require("./db/employee.model");
const EquipmentModel = require("./db/equipment.model");
const FavoriteBrandModel = require("./db/favoriteBrand.model")
const ColourModel = require("./db/colours.model")
const ToolsModel = require("./db/tools.model");
const BoardGameModel = require("./db/boardGame.model");
const DivisionModel = require("./db/division.model");
const LocationModel = require("./db/location.model");
const employeeModel = require("./db/employee.model");

// Extract necessary environment variables
const { MONGO_URL, PORT = 8080 } = process.env;

// Ensure the MONGO_URL is provided; if not, exit the application
if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

// Create an instance of express app
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
      .populate("division")
      .populate("location")
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
      .populate("favoriteBrand")
      .populate("favouriteColour")
      .populate("favoriteTools")
      .populate("assignedEquipment")
      .populate("favoriteBoardGame")
      .populate("division")
      .populate("location")
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
        { firstName: { $regex: new RegExp(employeeSearch, "i") } },  // regExp = MongoDB Regular Expression
        { middleName: { $regex: new RegExp(employeeSearch, "i") } }, // i = case insensitive
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
app.patch("/api/missing", async (req, res, next) => {
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

// Update employee present status by ID
app.patch('/api/employees/:id/present', async (req, res) => {
  const { id } = req.params;
  const { present } = req.body;

  try {
    const employee = await EmployeeModel.findById(id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    employee.present = present;

    await employee.save();

    res.status(200).json({ message: 'Updated successfully', employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Update employee address by ID
app.patch("/api/employees/:id/address", async (req, res) => {
  try {
    const { id } = req.params;
    const { country, city, street, zipCode } = req.body;

    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      id, {
        address: {
          country,
          city,
          street,
          zipCode
        }
      },
      { new: true } // returns the updated document
    );
    // Check if employee exists
    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee address", error);
    res.status(500).json({ error: "Error updating employee address" });
  }
});

// Delete single employee by ID
app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }    
    const deleted = await employee.delete();
    return res.json({ deleted, success: true, message: "Employee deleted successfully." });
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


// ----- LOCATIONS ----- //

app.get("/api/locations", async (req, res) => {
  try {
    const locations = await LocationModel.find();
    return res.json(locations);
  } catch (error) {
    console.error("Error getting locations", error);
    return res.status(500).json({ error: "Error getting locations" });
  }
})


// ----- BOARD GAMES ----- //

// Fetch games
app.get("/api/games", async (req, res) => {
  try {
    const maxPlayers = req.query.maxPlayers;
    let query = {};

    if (maxPlayers) {
      query.maxPlayers = { $lte: Number(maxPlayers) } // $lte = less than or equal - MongoDB operator
    }

    const games = await BoardGameModel.find(query); // query as parameter
    return res.json(games);
  } catch (error) {
    console.error("Error saving games", error);
    return res.status(500).json({ error: "Error saving games" });
  }
});

// Fetch single game based on ID
app.get("/api/games/:id", async (req, res) => {
  try {
    const gameId = req.params.id; // Extract ID from URL
    const game = await BoardGameModel.findById(gameId); // Get single game by its ID

    if (!game) {
      return res.status(404).json({ error: "Game not found" }); // If no game with given ID
    }

    return res.json(game); // Return the found game
  } catch (error) {
    console.error("Error fetching the game", error);
    return res.status(500).json({ error: "Error fetching the game" });
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
    const nameFilter = req.query.name;
    let tools;

    if (nameFilter) {
      tools = await ToolsModel.find({ name: { $regex: new RegExp(nameFilter, "i") } });
    } else {
      tools = await ToolsModel.find();
    }
    return res.json(tools);
  } catch (error) {
    console.error("Error fetching tools", error);
    return res.status(500).json({ error: "Error fetching tools" });
  }
});

// Fetch single tool by ID
app.get("/api/tools/:id", async (req, res) => {
  try {
    const toolId = req.params.id;
    const tool = await ToolsModel.findById(toolId);
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    } 
    return res.json(tool)
  } catch (error) {
    console.error("Error fetching tool by ID", error);
    return res.status(500).json({ error: "Error fetching tool by ID" });
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


// ----- PETS ----- //

app.post("/api/pets/:employeeId", async (req, res) => {
  try {
    const employee = await employeeModel.findById(req.params.employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    console.log(req.body);  // to ensure you are receiving correct data

    // Use Mongoose's updateOne to add to the pets array
    await employee.updateOne({ $push: { pets: req.body } });
    
    // No need for employee.save() here since updateOne will directly modify in the database

    return res.json(employee);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error adding pet to employee", error);
    return res.status(500).json({ error: "Error adding pet to employee" });
  }
});


app.get("/api/pets/:employeeId", async (req, res) => {
  try {
    const employee = await employeeModel.findById(req.params.employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.json(employee.pets)
  } catch (error) {
    console.error("Error fetching pets for employee", error);
    return res.status(500).json({ error: "Error fetching pets for employee" });
  }
});


// ----- DIVISIONS ----- //

// Fetch all divisions
app.get("/api/divisions", async (req, res) => {
  try {
    const divisions = await DivisionModel.find().populate({ path: "boss", select: ["firstName", "middleName", "lastName"] }); 
    return res.json(divisions);
  } catch (error) {
    console.error("Error fetching divisions", error);
    return res.status(500).json({ error: "Error fetching divisions" });
  }
});

// Fetch single division by ID
app.get("/api/divisions/:id", async (req, res) => {
  try {
    const division = await DivisionModel.findById(req.params.id).populate({ path: "boss", select: ["firstName", "middleName", "lastName"] });
    return res.json(division);
  } catch (error) {
    console.error("Error fetching division by ID", error);
    res.status(500).json({ error: "Error fetching division by ID" });
  }
});
  
  // Create new division
app.post("/api/divisions", async (req, res) => {
  try {
    const division = await DivisionModel.create(req.body);
    return res.json(division);
  } catch (error) {
    console.error("Error creating division", error);
    return res.status(500).json({ error: "Error creating division" });
  }
});

// Update division by ID
app.patch("/api/divisions/:id", async (req, res) => {
  try {
    const updatedDivision = await DivisionModel.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true } // Return the updated division
    );
    return res.json(updatedDivision);
  } catch (error) {
    console.error("Error updating division by ID", error);
    return res.status(500).json({ error: "Error updating division by ID" });
  }
});

// Delete division by ID
app.delete("/api/divisions/:id", async (req, res) => {
  try {
    const deletedDivision = await DivisionModel.findByIdAndRemove(req.params.id);
    if (!deletedDivision) {
      return res.status(404).json({ error: "Division not found" })
    }
    return res.json({ success: true, message: "Division deleted successfully" });
  } catch (error) {
    console.error("Error deleting division by ID", error);
    res.status(500).json({ error: "Error deleting division by ID" });
  }
});



// ----- MAIN ----- // 

// Main function to set up and run the server
const main = async () => {
  // Connect to MongoDB using the provided URL
  await mongoose.connect(MONGO_URL);

  // Start the express server on the specified port
  app.listen(PORT, () => {
    console.log("Server successfully started");
    console.log("App is listening on port:", PORT);
  });
};

// Execute the main function to start the server. If there's any error, log it and exit the process
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
