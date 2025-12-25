const admin = require('firebase-admin');

exports.updateUserProfile = async (data, context) => {
  const { uid, updates } = data;
  if (!uid || !updates) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing user or updates data');
  }
  await admin.firestore().doc(`users/${uid}/profile/info`).update(updates);
  return { success: true };
};
