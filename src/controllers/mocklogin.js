import { findByUsername } from '../models/mockusers.js';
import { loginSchema } from '../validation/authValidation.js';
import createHttpError from 'http-errors';

export const mockLogin = (req, res, next) => {
    try {
        // ✅ Validate request body
        const { error } = loginSchema.validate(req.body, { abortEarly: false });

        if (error) return next(error); // ✅ Automatically handled by `errorHandler.js`

        const { username, password } = req.body;

        // ✅ Find user
        const user = findByUsername(username);
        if (!user || user.password !== password) {
            return next(createHttpError(401, 'Invalid credentials'));
        }

        // ✅ Return response
        res.json({
            success: true,
            token: 'mockToken123',
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                expiresIn: '1h'
            }
        });
    } catch (error) {
        next(createHttpError(500, 'Internal Server Error'));
    }
};
