import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: "newtalents-a7c29",

      client_email:
        "firebase-adminsdk-1rafg@newtalents-a7c29.iam.gserviceaccount.com",

      private_key: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyFYjoVlSk/QK8
eEauVtAeodef7xPWZTPeiYP9R5ULwIWAiiko6KbdStldwuA9e+34e0qCTEHVslBA
pseozByZ/k/PAgtsygL39n7cq+G8huS4HdOy3KlE8RJQip4u7X/g27ZtIr1l19kb
Q23D2FQ8vhiNzUA3zP2ZKcYvq7tif7jmNfVQNzVeGXg6Xuhd5PK1xy0gsxfA0Mct
CO91t8JGQa2l4urkc/cawxaYTUKcPduDJE5lyQ8ZU0Z+4EPJQ8ZSa5s4GNrgTGZG
++Uu8Kk6OQSUUvr5qfhgbZikQ9XMPTIoDWgdKu77R6QsgpRE+RV3sCgcrJxZIcwn
Zw21XflRAgMBAAECggEAKmgCYAEeyuMM4cBqZF171a+IXydZO/aBcX6hlZCUJ2ZC
...
-----END PRIVATE KEY-----`,
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
    return res.status(400).json({
      message: "uid cyangwa docKey birabura",
    });
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
    console.error("DELETE USER ERROR:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
