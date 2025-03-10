// src/config/dbSwitcher.js

import db from "./connect.js"; // ✅ Import database connection
import fs from "fs/promises"; // ✅ For local JSON database operations
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables

// ✅ Define database state (json, local, or cloud)
const dbState = process.env.DB_STATE || "local";

// ✅ Flag for external database usage
const useExternalDB = dbState !== "json"; // True for MySQL, false for JSON

// ✅ Read local JSON file
const readLocalDb = async (filePath) => {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
};

// ✅ Write to local JSON file
const writeLocalDb = async (filePath, newData) => {
  await fs.writeFile(filePath, JSON.stringify(newData, null, 2));
};

// ✅ Dynamic database query function (Works for both JSON and MySQL)
const dbQuery = async (table, method, data = {}) => {
  if (useExternalDB) {
    // ✅ If using MySQL (local or cloud)
    switch (method) {
      case "selectAll":
        return await db(table).select("*");
      case "selectOne":
        return await db(table).where(data.idField, data.id).first();
      case "insert":
        return await db(table).insert(data.record).returning("*");
      case "update":
        return await db(table).where(data.idField, data.id).update(data.record);
      case "delete":
        return await db(table).where(data.idField, data.id).del();
      default:
        throw new Error(`Unsupported database method: ${method}`);
    }
  } else {
    // ✅ If using local JSON storage
    const localDb = await readLocalDb(data.filePath);
    switch (method) {
      case "selectAll":
        return localDb[table] || [];
      case "selectOne":
        return localDb[table]?.find(item => item[data.idField] === data.id);
      case "insert":
        localDb[table] = localDb[table] || [];
        localDb[table].push(data.record);
        await writeLocalDb(data.filePath, localDb);
        return data.record;
      case "update":
        const index = localDb[table]?.findIndex(item => item[data.idField] === data.id);
        if (index === -1) return null;
        localDb[table][index] = { ...localDb[table][index], ...data.record };
        await writeLocalDb(data.filePath, localDb);
        return localDb[table][index];
      case "delete":
        localDb[table] = localDb[table]?.filter(item => item[data.idField] !== data.id);
        await writeLocalDb(data.filePath, localDb);
        return { message: `${table} record deleted` };
      default:
        throw new Error(`Unsupported JSON method: ${method}`);
    }
  }
};

// ✅ Ensure everything is correctly exported
export { dbQuery, useExternalDB, dbState };
