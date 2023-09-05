/*
Loading the .env file and creates environment variables from it
*/
require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const EmployeeModel = require("../db/employee.model");
const EquipmentModel = require("../db/equipment.model")
const FavoriteBrandModel = require("../db/favoriteBrand.model")
const colours = require("../server");
const favouriteBrands = require("./favoriteBrands.json");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // exit the current program
}

const pick = (from) => from[Math.floor(Math.random() * (from.length - 0))];

const populateEmployees = async () => {
  await EmployeeModel.deleteMany({});
  await EquipmentModel.deleteMany({});
  await FavoriteBrandModel.deleteMany({});
  
  await FavoriteBrandModel.insertMany(favouriteBrands);

  const favoriteBrandsData = await FavoriteBrandModel.find();

  const employees = names.map((name) => {
      const nameParts = name.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";
      
      const oldestStartDate = new Date("1991-12-24");
      const newestStartDate = new Date(); // Current date
      const randomStartDate = new Date(oldestStartDate.getTime() + Math.random() * (newestStartDate.getTime() - oldestStartDate.getTime()));

      const randomCurrentSalary = Math.floor(Math.random() * (5000 - 4000)) + 4000;
      const randomDesiredSalary = Math.floor(Math.random() * (10000 - 5000)) + 5000;

      const favouriteColour = pick(colours);

      const favoriteBrand = pick(favoriteBrandsData)._id;


      return {
        firstName,
        middleName,
        lastName,
        level: pick(levels),
        position: pick(positions),
        startingDate: randomStartDate,
        currentSalary: randomCurrentSalary,
        desiredSalary: randomDesiredSalary,
        favouriteColour,
        favoriteBrand,
      };
  });

  await EmployeeModel.create(...employees);
  console.log("Employees created");
};


const main = async () => {
  await mongoose.connect(mongoUrl);

  await populateEmployees();

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
