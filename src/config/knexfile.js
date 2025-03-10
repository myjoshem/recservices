import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure NODE_ENV is set (default to "development" if not specified)
const environment = process.env.NODE_ENV || "development";

// ✅ Knex configuration object
const dbConfig = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "my-secret-password",
      database: process.env.DB_NAME || "my_backend_db",
      port: process.env.DB_PORT || 3306
    },
    migrations: {
      directory: path.join(__dirname, "../migrations")
    },
    seeds: {
      directory: path.join(__dirname, "../seeds")
    }
  },
  
  production: {
    client: "mysql2",
    connection: process.env.DATABASE_URL, // ✅ Uses Railway's connection string
    migrations: {
      directory: path.join(__dirname, "../migrations")
    },
    seeds: {
      directory: path.join(__dirname, "../seeds")
    }
  }
};

// ✅ Export only the correct configuration based on the environment
export default dbConfig[environment];
