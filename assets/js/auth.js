const playerPasswords = {
  'aragorn': 'hash_of_password_1',
  'gandalf': 'hash_of_password_2',
  'legolas': 'hash_of_password_3'
};

function authenticatePlayer(username, password) {
  const hashedInput = simpleHash(password);
  if (playerPasswords[username] === hashedInput) {
    sessionStorage.setItem('currentPlayer', username);
    loadPlayerData(username);
    return true;
  }
  return false;
}

function simpleHash(str) {
  return btoa(str);
}
