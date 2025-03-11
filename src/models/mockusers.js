// models/mockUser.js
export const mockUsers = [
    {
        id: 1,
        username: 'testuser',
        password: 'password123', // Normally, passwords should be hashed!
        role: 'admin'
    },
    {
        id: 2,
        username: 'regularuser',
        password: 'testpass',
        role: 'user'
    }
];

/**
 * Finds a mock user by username.
 * @param {string} username
 * @returns {Object | undefined}
 */
export const findByUsername = (username) => {
    return mockUsers.find(user => user.username === username);
};
