import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "newtalents-a7c29",

      private_key_id: "PASTE_PRIVATE_KEY_ID",

      private_key: `-----BEGIN PRIVATE KEY-----
PASTE_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----`,

      client_email:
        "firebase-adminsdk-xxxxx@newtalents-a7c29.iam.gserviceaccount.com",

      client_id: "PASTE_CLIENT_ID",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url:
        "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40newtalents-a7c29.iam.gserviceaccount.com",
    }),
  });
}

const db = admin.firestore();
const auth = admin.auth();

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { uid, docKey } = req.body;

  if (!uid || !docKey) {
    return res.status(400).json({ message: "Missing uid or docKey" });
  }

  try {
    // 1️⃣ Gusiba user muri Firebase Authentication
    await auth.deleteUser(uid);

    // 2️⃣ Gusiba amakuru ye muri Firestore
    await db.collection("userdate").doc("data").update({
      [docKey]: admin.firestore.FieldValue.delete(),
    });

    return res.status(200).json({
      success: true,
      message: "User yasibwe burundu (Auth + Firestore)",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
