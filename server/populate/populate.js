require("dotenv").config();
const mongoose = require("mongoose");

// Import JSON files
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const favouriteBrands = require("./favoriteBrands.json");
const colours = require("./colours.json");
const tools = require("./tools.json");
const equipments = require("./equipment.json");
const boardGames = require("./boardGames.json");

// Import each Schema
const EmployeeModel = require("../db/employee.model");
const EquipmentModel = require("../db/equipment.model");
const FavoriteBrandModel = require("../db/favoriteBrand.model");
const ColourModel = require("../db/colours.model");
const ToolsModel = require("../db/tools.model");
const BoardGameModel = require("../db/boardGame.model");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const pick = (from) => from[Math.floor(Math.random() * from.length)];

const populateEquipments = async () => {
  await EquipmentModel.deleteMany({});
  await EquipmentModel.insertMany(equipments);
  console.log("Equipment created");
};

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

const populateEmployees = async () => {
  await EmployeeModel.deleteMany({});

  const equipmentData = await EquipmentModel.find();
  const favoriteBrandsData = await FavoriteBrandModel.find();
  const coloursData = await ColourModel.find();
  const toolsData = await ToolsModel.find();
  const boardGamesData = await BoardGameModel.find();

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

const main = async () => {
  await mongoose.connect(mongoUrl);

  await populateEquipments();
  await populateFavouriteBrands();
  await populateColours();
  await populateTools();
  await populateBoardGames();
  await populateEmployees(); // Make sure to populate Employees last

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
