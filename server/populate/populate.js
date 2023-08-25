// .env fájl beolvasása és környezeti változók létrehozása
require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json"); // Az alkalmazott nevek
const levels = require("./levels.json"); // Az alkalmazott szintek
const positions = require("./positions.json"); // Az alkalmazott pozíciók
const EmployeeModel = require("../db/employee.model"); // Az alkalmazottak adatmodellje

const mongoUrl = process.env.MONGO_URL; // MongoDB URL környezeti változóból

// MongoDB URL ellenőrzése
if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // Kilépés a programból
}

// Véletlenszerű elem kiválasztása tömbből
const pick = (from) => from[Math.floor(Math.random() * (from.length - 0))];

// Alkalmazottak létrehozása és feltöltése a MongoDB-be
const populateEmployees = async () => {
  await EmployeeModel.deleteMany({}); // Az összes alkalmazott törlése

  const employees = names.map((name) => {
    const [firstName, middleName, lastName] = name.split(" ");
    return {
      firstName,
      middleName,
      lastName,
      level: pick(levels), // Véletlenszerű szint választása
      position: pick(positions), // Véletlenszerű pozíció választása
    };
  });

  await EmployeeModel.create(...employees); // Alkalmazottak létrehozása
  console.log("Employees created");
};

// Fő függvény indítása
const main = async () => {
  await mongoose.connect(mongoUrl); // MongoDB kapcsolat létrehozása

  await populateEmployees(); // Alkalmazottak feltöltése

  await mongoose.disconnect(); // Kapcsolat bontása
};

// Fő függvény hívása és hibakezelés
main().catch((error) => {
  console.error(error);
  process.exit(1); // Kilépés a programból
});
