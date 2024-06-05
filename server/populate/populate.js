require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const EmployeeModel = require("../db/employee.model");
const EquipmentModel = require("../db/equipment.model");

const mongoUrl = process.env.MONGO_URL; // MongoDB URL from environment variable

// Check MongoDB URL
if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // Exit the program
}

// Pick a random element from an array
const pick = (from) => from[Math.floor(Math.random() * from.length)];

// Generate a random phone number starting with 0630 followed by 7 digits
const generatePhoneNumber = () => `0630${Math.floor(1000000 + Math.random() * 9000000)}`;

// Generate random equipment
const generateEquipment = () => {
  const equipmentTypes = ["Laptop", "Monitor", "Keyboard", "Mouse", "Printer"];
  const equipment = [];

  for (let i = 0; i < equipmentTypes.length; i++) {
    equipment.push({
      name: `${equipmentTypes[i]}`,
      type: equipmentTypes[i],
      amount: Math.floor(1 + Math.random() * 100),
    });
  }

  return equipment;
};

// Create and populate employees and equipment in MongoDB
const populateEmployeesAndEquipment = async () => {
  await EmployeeModel.deleteMany({}); // Delete all employees
  await EquipmentModel.deleteMany({}); // Delete all equipment

  const equipment = generateEquipment();
  const createdEquipment = await EquipmentModel.create(equipment); // Create equipment

  const employees = names.map((name) => {
    const parts = name.split(" ");
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const middleName = parts.length === 3 ? parts[1] : ""; // Use middle name if present

    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;

    // Assign 1-3 random pieces of equipment to each employee
    const assignedEquipment = [];
    const numberOfEquipment = Math.floor(1 + Math.random() * 3);
    for (let i = 0; i < numberOfEquipment; i++) {
      const randomEquipment = pick(createdEquipment);
      if (!assignedEquipment.includes(randomEquipment._id)) {
        assignedEquipment.push(randomEquipment._id);
      }
    }

    return {
      firstName,
      middleName: middleName || undefined, // Use undefined if no middle name
      lastName,
      level: pick(levels),
      position: pick(positions),
      phone: generatePhoneNumber(),
      email: email,
      equipment: assignedEquipment,
    };
  });

  await EmployeeModel.create(employees); // Create employees
  console.log("Employees and equipment created");
};

// Main function
const main = async () => {
  await mongoose.connect(mongoUrl);

  await populateEmployeesAndEquipment();

  await mongoose.disconnect();
};

// Call the main function and handle errors
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
