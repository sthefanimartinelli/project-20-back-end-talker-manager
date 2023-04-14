// Código baseado em thread do StackOverflow: https://stackoverflow.com/questions/8532406/create-a-random-token-in-javascript-based-on-user-details

const randomToken = (length) => {
  const range = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
  const newToken = [];  
  for (let index = 0; index < length; index += 1) {
      const currentChar = (Math.random() * (range.length - 1)).toFixed(0);
      newToken[index] = range[currentChar];
  }
  return newToken.join('');
};

module.exports = randomToken;