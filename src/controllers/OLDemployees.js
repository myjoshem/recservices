import fs from "fs/promises";
import { getDBConfig } from "../config/dbConfig.js";
import { validateData } from "../validation/schemaValidation.js";

// ***************************************************
// 🚀 DYNAMIC DATABASE CONFIGURATION 🚀
// Change the `dbName` variable to switch the database.
// This makes the controller reusable for different datasets.
// ***************************************************
const dbName = "employees"; // Change this based on the controller

const dbConfig = getDBConfig(dbName);

if (!dbConfig) {
  throw new Error(`Database configuration for ${dbName} not found.`);
}

const { DB_TITLE, DB_ID, FILE_PATH } = dbConfig;
console.log(`🔹 Using database: ${DB_TITLE}`);

// ***************************************************

// ✅ Function to read data from JSON file
const readData = async () => {
  const data = await fs.readFile(FILE_PATH, "utf8");
  return JSON.parse(data);
};

// ✅ Function to write updated data back to the JSON file
const writeData = async (data) => {
  await fs.writeFile(FILE_PATH, JSON.stringify({ [DB_TITLE]: data }, null, 2));
};

// ✅ Get all employees
export const getMany = async (req, res, next) => {
  try {
    const data = await readData();
    res.status(200).json(data[DB_TITLE]);
  } catch (error) {
    next(error);
  }
};

// ✅ Get a single employee by ID
export const getOne = async (req, res, next) => {
  try {
    const data = await readData();
    const record = data[DB_TITLE].find(item => item[DB_ID] === req.params.id);

    if (!record) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

// ✅ Create a new employee
export const create = async (req, res, next) => {
  try {
    const { error } = validateData(DB_TITLE, req.body);
    if (error) {
      return res.status(400).json({ error: "Validation failed", details: error.details.map(e => e.message) });
    }

    const data = await readData();
    const records = data[DB_TITLE];

    if (records.some(item => item[DB_ID] === req.body[DB_ID])) {
      return res.status(400).json({ error: "Employee ID already exists" });
    }

    records.push(req.body);
    await writeData(records);

    res.status(201).json({ message: "Employee added successfully", record: req.body });
  } catch (error) {
    next(error);
  }
};

// ✅ Update an existing employee
export const update = async (req, res, next) => {
  try {
    const { error } = validateData(DB_TITLE, req.body);
    if (error) {
      return res.status(400).json({ error: "Validation failed", details: error.details.map(e => e.message) });
    }

    const data = await readData();
    const records = data[DB_TITLE];

    const index = records.findIndex(item => item[DB_ID] === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Employee not found" });
    }

    records[index] = { ...records[index], ...req.body };
    await writeData(records);

    res.status(200).json({ message: "Employee updated successfully", record: records[index] });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete an employee
export const deleteOne = async (req, res, next) => {
  try {
    const data = await readData();
    const records = data[DB_TITLE];

    const index = records.findIndex(item => item[DB_ID] === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Employee not found" });
    }

    records.splice(index, 1);
    await writeData(records);

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default {
  getMany,
  getOne,
  create,
  update,
  deleteOne
};
