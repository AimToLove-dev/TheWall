/**
 * Import function triggers from their respective submodules:
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const logger = functions.logger;

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// HTTP Function that responds with a greeting when called
exports.greetUser = functions.https.onRequest((req, res) => {
  logger.info("Function was triggered!"); // Using logger instead of console.log
  res.send("Hello from greetUser!");
});
