import path from "path";
import { fileURLToPath } from "url";

// ✅ Ensure ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Configuration for all database tables (Expand as needed)
const dbConfigs = {
  employees: {
    DB_TITLE: "employees",
    DB_ID: "employee_id", // Matches MySQL column name
    FILE_PATH: path.join(__dirname, "../data/employees.json"),
  },
  locations: {
    DB_TITLE: "locations",
    DB_ID: "location_id", // Matches MySQL column name
    FILE_PATH: path.join(__dirname, "../data/locations.json"),
  },
  positions: {
    DB_TITLE: "positions",
    DB_ID: "position_id", // Matches MySQL column name
    FILE_PATH: path.join(__dirname, "../data/positions.json"),
  },
  shifts: {
    DB_TITLE: "shifts",
    DB_ID: "shift_id", // Matches MySQL column name
    FILE_PATH: path.join(__dirname, "../data/shifts.json"),
  },
  users: {
    DB_TITLE: "auth.users",
    DB_ID: "id", // Matches MySQL column name
    FILE_PATH: path.join(__dirname, "../data/users.json"),
  }
};

// ✅ Function to retrieve the correct configuration for any table
export const getDBConfig = (dbName) => {
  if (!dbConfigs[dbName]) {
    throw new Error(`Database configuration for '${dbName}' not found.`);
  }
  return dbConfigs[dbName];
};
