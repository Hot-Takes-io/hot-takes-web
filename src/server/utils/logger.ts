// function that logs the string to the console
// all in yellow text
const Logger = (string: string) => {
  console.log(`\x1b[33m${string}\x1b[0m`);
};

export default Logger;
