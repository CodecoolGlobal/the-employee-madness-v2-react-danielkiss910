// Szükséges modulok importálása
require("dotenv").config(); // Környezeti változók kezelése
const express = require("express"); // Express keretrendszer
const mongoose = require("mongoose"); // MongoDB kezelése
const EmployeeModel = require("./db/employee.model"); // Az alkalmazottak adatmodellje
const EquipmentModel = require("./db/equipment.model"); // Az eszközök adatmodellje

// Környezeti változók beállítása
const { MONGO_URL, PORT = 8080 } = process.env;

// MongoDB URL ellenőrzése
if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

// Express alkalmazás inicializálása
const app = express();
app.use(express.json()); // JSON adatok kezelése

// Alkalmazottak kezelése

// Alkalmazottak lekérdezése
app.get("/api/employees/", async (req, res) => {
  const employees = await EmployeeModel.find().sort({ created: "desc" });
  return res.json(employees);
});

// Egy alkalmazott lekérdezése azonosító alapján
app.get("/api/employees/:id", async (req, res) => {
  const employee = await EmployeeModel.findById(req.params.id);
  return res.json(employee);
});

app.get("/api/employees/:search", async (req, res, next) => {
  try {
    const searchQuery = req.params.search;
    const matchingEmployees = await EmployeeModel.find({
      $or: [ // Az `$or` operátor miatt bármelyik feltétel teljesülése esetén az adott dokumentum bekerül a lekérdezés eredményébe.
        { firstName: { $regex: searchQuery, $options: "i" } }, // $regex operátor a reguláris kifejezés illesztésére szolgál.
        { middleName: { $regex: searchQuery, $options: "i" } }, // $options: "i" pedig azt jelzi, hogy a keresés legyen nem kis- és nagybetűk közötti különbség érzékeny.
        { lastName: { $regex: searchQuery, $options: "i" } },
      ]
    }).sort({ created: "desc" }); // `created` mező alapján csökkenő sorrendben rendezzük őket

    return res.json(matchingEmployees);
  } catch (error) {
    return next(err);
  }
});

// Új alkalmazott létrehozása
app.post("/api/employees/", async (req, res, next) => {
  const employee = req.body;

  try {
    const saved = await EmployeeModel.create(employee);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

// Alkalmazott frissítése azonosító alapján
app.patch("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.json(employee);
  } catch (err) {
    return next(err);
  }
});

// Alkalmazott törlése azonosító alapján
app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    const deleted = await employee.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

// Eszközök kezelése

// Összes eszköz lekérdezése
app.get("/api/equipment", async (req, res) => {
  const equipment = await EquipmentModel.find().sort({ created: "desc" });
  return res.json(equipment);
});

// Egy eszköz lekérdezése azonosító alapján
app.get("/api/equipment/:id", async (req, res) => {
  const equipment = await EquipmentModel.findById(req.params.id);
  return res.json(equipment);
});

// Új eszköz létrehozása
app.post("/api/equipment/", async (req, res, next) => {
  const equipment = req.body;

  try {
    const saved = await EquipmentModel.create(equipment);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

// Egy eszköz frissítése azonosító alapján
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

// Egy eszköz törlése azonosító alapján
app.delete("/api/equipment/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findById(req.params.id);
    const deleted = await equipment.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

// Fő függvény indítása
const main = async () => {
  await mongoose.connect(MONGO_URL); // MongoDB kapcsolat létrehozása

  app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
    console.log("Try /api/employees route right now");
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
