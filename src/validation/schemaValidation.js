import Joi from "joi";

// Define validation schemas for different database collections
const validationSchemas = {
  employees: Joi.object({
    employee_id: Joi.number().integer().optional(), // Primary Key (auto-increment)
    user_id: Joi.string().uuid().optional().allow(null), // Supabase UUID
    first_name: Joi.string().trim().min(1).max(50).required(),
    last_name: Joi.string().trim().min(1).max(50).required(),
    position_id: Joi.number().integer().optional().allow(null),
    location_id: Joi.number().integer().optional().allow(null),
    email: Joi.string().email().required(),
    phone_number: Joi.string()
      .pattern(/^[0-9-]+$/)
      .min(10)
      .max(15)
      .optional()
      .allow(null, ""),
    is_hourly: Joi.boolean().required(),
    is_salaried: Joi.boolean().required(),
    is_active: Joi.boolean().required()
  }),

  locations: Joi.object({
    location_id: Joi.number().integer().optional(), // Primary Key (auto-increment)
    location_name: Joi.string().trim().min(1).max(100).required(),
    employee_count: Joi.number().integer().optional().allow(null),
    physical_address: Joi.string().trim().max(255).optional().allow(null, ""),
  }),

  positions: Joi.object({
    position_id: Joi.number().integer().optional(), // Primary Key (auto-increment)
    position_name: Joi.string().trim().min(1).max(100).required(),
    position_count: Joi.number().integer().optional().allow(null),
  }),

  shifts: Joi.object({
    shift_id: Joi.number().integer().optional(), // Primary Key (auto-increment)
    employee_id: Joi.number().integer().required(), // Foreign Key
    shift_start: Joi.date().iso().required(),
    shift_end: Joi.date().iso().required(),
    is_up_for_trade: Joi.boolean().required()
  })
};

// Function to validate data dynamically based on `dbTitle`
export const validateData = (dbTitle, data) => {
  const schema = validationSchemas[dbTitle];
  if (!schema) {
    throw new Error(`No validation schema found for '${dbTitle}'`);
  }
  return schema.validate(data, { abortEarly: false });
};
