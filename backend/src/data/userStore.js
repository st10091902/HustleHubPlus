const users = [];

/**
 * Finds a user by email address.
 */
const findUserByEmail = (email) => {
  return users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
};

/**
 * Adds a user to the temporary in-memory store.
 */
const addUser = (user) => {
  users.push(user);
  return user;
};

module.exports = {
  users,
  findUserByEmail,
  addUser
};