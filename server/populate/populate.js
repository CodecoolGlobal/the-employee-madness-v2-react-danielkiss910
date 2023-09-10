// Load environment variables from a .env file
require("dotenv").config();

// MongoDB Object Data Modeling (ODM) library
const mongoose = require("mongoose");

// Importing static JSON data files
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const favouriteBrands = require("./favoriteBrands.json");
const colours = require("./colours.json");
const tools = require("./tools.json");
const equipments = require("./equipment.json");
const boardGames = require("./boardGames.json");

// Importing database models
const EmployeeModel = require("../db/employee.model");
const EquipmentModel = require("../db/equipment.model");
const FavoriteBrandModel = require("../db/favoriteBrand.model");
const ColourModel = require("../db/colours.model");
const ToolsModel = require("../db/tools.model");
const BoardGameModel = require("../db/boardGame.model");
const DivisionModel = require("../db/division.model");

// Grabbing the Mongo connection URL from the environment variables
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

// Helper function to randomly pick an element from an array
const pick = (from) => from[Math.floor(Math.random() * from.length)];

// Populate Equipment collection with data from equipments.json
const populateEquipments = async () => {
  await EquipmentModel.deleteMany({}); // Clear existing entries
  await EquipmentModel.insertMany(equipments); // Insert new ones
  console.log("Equipment created");
};

// Similarly, define functions to populate other collections
const populateFavouriteBrands = async () => {
  await FavoriteBrandModel.deleteMany({});
  await FavoriteBrandModel.insertMany(favouriteBrands);
  console.log("Favorite brands created");
};

const populateColours = async () => {
  await ColourModel.deleteMany({});
  await ColourModel.insertMany(colours);
  console.log("Colours created");
};

const populateTools = async () => {
  await ToolsModel.deleteMany({});
  await ToolsModel.insertMany(tools);
  console.log("Tools created");
};

const populateBoardGames = async () => {
  await BoardGameModel.deleteMany({});
  await BoardGameModel.insertMany(boardGames);
  console.log("Board games created");
};

// Populate the Employees collection with randomly generated data based on predefined lists
const populateEmployees = async () => {
  await EmployeeModel.deleteMany({});

  // Fetch required data from other collections
  const equipmentData = await EquipmentModel.find();
  const favoriteBrandsData = await FavoriteBrandModel.find();
  const coloursData = await ColourModel.find();
  const toolsData = await ToolsModel.find();
  const boardGamesData = await BoardGameModel.find();

  // Generate a list of employees using data from names.json and other random values
  const employees = names.map((name) => {
      const nameParts = name.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";
      
      const oldestStartDate = new Date("1991-12-24");
      const newestStartDate = new Date();
      const randomStartDate = new Date(oldestStartDate.getTime() + Math.random() * (newestStartDate.getTime() - oldestStartDate.getTime()));

      const randomCurrentSalary = Math.floor(Math.random() * (5000 - 4000)) + 4000;
      const randomDesiredSalary = Math.floor(Math.random() * (10000 - 5000)) + 5000;

      const assignedEquipment = pick(equipmentData)._id;
      const favoriteBrand = pick(favoriteBrandsData)._id;
      const favouriteColour = pick(coloursData)._id;
      const favoriteTool = pick(toolsData)._id;
      const favoriteBoardGame = pick(boardGamesData)._id;

      return {
        firstName,
        middleName,
        lastName,
        level: pick(levels),
        position: pick(positions),
        startingDate: randomStartDate,
        currentSalary: randomCurrentSalary,
        desiredSalary: randomDesiredSalary,
        assignedEquipment,
        favouriteColour,
        favoriteBrand,
        favoriteTool,
        favoriteBoardGame,
      };
  });

  await EmployeeModel.create(...employees);
  console.log("Employees created");
};

// Function to get a random employee from the database (to assign as division boss)
const getRandomEmployee = async () => {
  const employees = await EmployeeModel.find();
  const randomIndex = Math.floor(Math.random() * employees.length);
  return employees[randomIndex]._id;
}

// Populate the Divisions collection with predefined values and random employee boss
const populateDivisions = async () => {
  await DivisionModel.deleteMany({});

  const divisions = [
    {
      name: "Division 1",
      boss: await getRandomEmployee(),
      budget: 1000000,
      location: {
        city: "City 1",
        country: "Country 1",
      },
    },
    {
      name: "Division 2",
      boss:await getRandomEmployee(),
      budget: 800000,
      location: {
        city: "City 2",
        country: "Country 2",
      },
    },
  ];

  await DivisionModel.insertMany(divisions);
  console.log("Divisions created");
};

// Main function to run all the populate functions in sequence
const main = async () => {
  // Connect to the MongoDB database using the provided URL
  await mongoose.connect(mongoUrl);

  // Populate collections
  await populateEquipments();
  await populateFavouriteBrands();
  await populateColours();
  await populateTools();
  await populateBoardGames();
  await populateEmployees(); // Ensure employees are populated after above to get correct data
  await populateDivisions(); // Ensure divisions are populated after employees to get "boss" data

  // Close the database connection
  await mongoose.disconnect();
};

// Run the main function and handle any errors that arise
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
