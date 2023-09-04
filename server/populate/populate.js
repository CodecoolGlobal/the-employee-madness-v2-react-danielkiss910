/*
Loading the .env file and creates environment variables from it
*/
require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const EmployeeModel = require("../db/employee.model");
const colours = require("../server");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // exit the current program
}

const pick = (from) => from[Math.floor(Math.random() * (from.length - 0))];

const populateEmployees = async () => {
  await EmployeeModel.deleteMany({});

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

    // const colours = ["Black", "Grey", "Red", "Blue", "Orange", "White", "Brown", "Pink", "Yellow", "Green", "Purple", "Maroon", "Turquoise", "Cyan", "Gold", "Teal", "Lime", "Salmon", "Olive", "Aqua", "Violet"];
    const favouriteColour = pick(colours);


    return {
      firstName,
      middleName,
      lastName,
      level: pick(levels),
      position: pick(positions),
      startingDate: randomStartDate,
      currentSalary: randomCurrentSalary,
      favouriteColour,
      desiredSalary: randomDesiredSalary,
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
