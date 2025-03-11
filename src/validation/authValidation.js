import Joi from 'joi';

// ✅ Define a schema for login validation
export const loginSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required()
});
