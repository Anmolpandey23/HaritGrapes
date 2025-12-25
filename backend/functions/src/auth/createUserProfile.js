const admin = require('firebase-admin');

exports.createUserProfile = async (data, context) => {
  const { uid, name, email, photoURL, language } = data;
  if (!uid || !name || !email) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required user fields');
  }

  await admin.firestore().doc(`users/${uid}/profile/info`).set({
    name,
    email,
    photoURL: photoURL || '',
    language: language || 'en',
    createdAt: new Date().toISOString()
  }, { merge: true });
  return { success: true };
};
