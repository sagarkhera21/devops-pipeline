const { v4: uuidv4 } = require('uuid');

// In-memory data store
let users = [
  { id: uuidv4(), name: 'Alice', email: 'alice@example.com' },
  { id: uuidv4(), name: 'Bob', email: 'bob@example.com' }
];

const getAllUsers = () => {
  return users;
};

const getUserById = (id) => {
  return users.find(user => user.id === id);
};

const createUser = (userData) => {
  const newUser = {
    id: uuidv4(),
    ...userData
  };
  users.push(newUser);
  return newUser;
};

const updateUser = (id, userData) => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    return null; // User not found
  }
  
  users[index] = { ...users[index], ...userData };
  return users[index];
};

const deleteUser = (id) => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    return false; // User not found
  }
  
  users.splice(index, 1);
  return true;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  // Exporting this strictly for test teardown/setup if we need to reset state
  resetUsers: () => {
    users = [];
  }
};
