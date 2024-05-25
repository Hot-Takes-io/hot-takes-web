// function that logs the string to the console
// all in yellow text
const Logger = (...params: unknown[]) => {
  console.log("\x1b[33m", ...params);
  console.log("\x1b[0m");
};

export default Logger;
