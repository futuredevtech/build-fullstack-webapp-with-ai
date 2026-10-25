/**
 * CourseHub — Admin Custom Claim Provisioning Script
 * 
 * Sets { admin: true } custom user claim on a Firebase Auth user.
 * 
 * IMPORTANT SECURITY RULES:
 * 1. Never commit serviceAccountKey.json to version control!
 * 2. Keep service account credentials strictly outside the browser bundle.
 * 3. Run this script only in your trusted local terminal or CI environment.
 * 
 * USAGE:
 *   1. Download your service account key from:
 *      Firebase Console -> Project Settings -> Service accounts -> Generate new private key
 *   2. Save it as `serviceAccountKey.json` in this `scripts/` directory (it is gitignored).
 *   3. Run:
 *      node scripts/set-admin-claim.js <user-email-or-uid>
 */

const fs = require('fs');
const path = require('path');

const targetIdentifier = process.argv[2];

if (!targetIdentifier) {
  console.error('\n❌ Error: Please provide a user email or UID.');
  console.log('Usage: node scripts/set-admin-claim.js <user-email-or-uid>\n');
  process.exit(1);
}

const keyPath = path.resolve(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(keyPath)) {
  console.error('\n❌ Error: serviceAccountKey.json not found in scripts/ directory.');
  console.log('\nTo provision an administrator:');
  console.log('1. Go to Firebase Console -> Project Settings -> Service accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Save the downloaded file as "scripts/serviceAccountKey.json"');
  console.log('4. Re-run: node scripts/set-admin-claim.js ' + targetIdentifier + '\n');
  process.exit(1);
}

try {
  const admin = require('firebase-admin');
  const serviceAccount = require(keyPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  async function grantAdmin() {
    let userRecord;
    if (targetIdentifier.includes('@')) {
      userRecord = await admin.auth().getUserByEmail(targetIdentifier);
    } else {
      userRecord = await admin.auth().getUser(targetIdentifier);
    }

    console.log(`\nFound user: ${userRecord.email || userRecord.uid} (UID: ${userRecord.uid})`);

    // Set custom claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    console.log(`\n✅ Success! Admin custom claim { admin: true } has been granted to ${userRecord.email || userRecord.uid}.`);
    console.log('Note: The user should sign out and sign back in for the ID token claims to refresh.\n');
    process.exit(0);
  }

  grantAdmin().catch((err) => {
    console.error('\n❌ Failed to set admin claim:', err.message);
    process.exit(1);
  });
} catch (err) {
  console.error('\n❌ Missing dependency. If firebase-admin is not installed locally, run:');
  console.log('npm install -D firebase-admin\n');
  process.exit(1);
}
