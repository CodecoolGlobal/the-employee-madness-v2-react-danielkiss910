require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const EmployeeModel = require("../db/employee.model");

const mongoUrl = process.env.MONGO_URL; // MongoDB URL from environment variable

// Check MongoDB URL
if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // Exit the program
}

// Pick a random element from an array
const pick = (from) => from[Math.floor(Math.random() * from.length)];

// Create and populate employees in MongoDB
const populateEmployees = async () => {
  await EmployeeModel.deleteMany({}); // Delete all employees

  const employees = names.map((name) => {
    const parts = name.split(" ");
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const middleName = parts.length === 3 ? parts[1] : ""; // Use middle name if present

    return {
      firstName,
      middleName: middleName || undefined, // Use undefined if no middle name
      lastName,
      level: pick(levels),
      position: pick(positions),
    };
  });

  await EmployeeModel.create(employees); // Create employees
  console.log("Employees created");
};

// Main function
const main = async () => {
  await mongoose.connect(mongoUrl);

  await populateEmployees();

  await mongoose.disconnect();
};

// Call the main function and handle errors
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
