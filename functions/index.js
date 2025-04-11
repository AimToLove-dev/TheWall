/**
 * Import function triggers from their respective submodules:
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// Callable function to handle soul form submission
exports.submitSoulForm = functions
  .region("us-central1")
  .https.onCall(async (data, context) => {
    const { email, firstName, lastName, state = null, city = null } = data;

    if (!email || !firstName || !lastName) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required fields"
      );
    }

    // If user is logged in and verified, save directly to "souls"
    if (context.auth && context.auth.token.email_verified) {
      const userId = context.auth.uid;
      await db.collection("souls").add({
        email,
        firstName,
        lastName,
        state,
        city,
        userId,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { status: "submitted" };
    }

    try {
      const userRecord = await auth.getUserByEmail(email);

      if (userRecord.emailVerified) {
        return { status: "verifiedUser" };
      } else {
        return { status: "unverifiedUser" };
      }
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        const submissionRef = db.collection("submissions").doc(email);
        const doc = await submissionRef.get();

        if (doc.exists) {
          return { status: "duplicateSubmission" };
        }

        // Create unverified user
        await auth.createUser({ email });

        // Store submission
        await submissionRef.set({
          email,
          firstName,
          lastName,
          state,
          city,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Send reset link (doubles as verification path)
        const link = await auth.generatePasswordResetLink(email);
        functions.logger.info("Reset link:", link);

        return { status: "createUser" };
      } else {
        functions.logger.error("Auth error:", err);
        throw new functions.https.HttpsError(
          "internal",
          "Unexpected error occurred"
        );
      }
    }
  });
