const admin = require('firebase-admin');

exports.saveUserScan = async (uid, scan) => {
  await admin.firestore().collection('users').doc(uid).collection('scans').add(scan);
};

exports.saveUserYield = async (uid, result) => {
  await admin.firestore().collection('users').doc(uid).collection('yield').add(result);
};

exports.saveUserFertilizer = async (uid, result) => {
  await admin.firestore().collection('users').doc(uid).collection('fertilizer').add(result);
};
