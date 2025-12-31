import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "newtalents-a7c29",

      private_key_id: "PASTE_PRIVATE_KEY_ID",

      
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyFYjoVlSk/QK8\neEauVtAeodef7xPWZTPeiYP9R5ULwIWAiiko6KbdStldwuA9e+34e0qCTEHVslBA\npseozByZ/k/PAgtsygL39n7cq+G8huS4HdOy3KlE8RJQip4u7X/g27ZtIr1l19kb\nQ23D2FQ8vhiNzUA3zP2ZKcYvq7tif7jmNfVQNzVeGXg6Xuhd5PK1xy0gsxfA0Mct\nCO91t8JGQa2l4urkc/cawxaYTUKcPduDJE5lyQ8ZU0Z+4EPJQ8ZSa5s4GNrgTGZG\n++Uu8Kk6OQSUUvr5qfhgbZikQ9XMPTIoDWgdKu77R6QsgpRE+RV3sCgcrJxZIcwn\nZw21XflRAgMBAAECggEAKmgCYAEeyuMM4cBqZF171a+IXydZO/aBcX6hlZCUJ2ZC\n5CcCQiGUiqGmPTOInluCgWcqiPiLvM1nWt3cMY/ZR7pNWugLvG4mYtGpx/aOHIyq\nrkU8Ah2VmTsmt1Mq89XOW8c2G6roGvZZVqqp2rcK6CQESNAVeLQxt2VBMlzclEmb\ngmAQD72ZZm/WBODMQA/UWQZC6DtocglCawkMDNyuSFxSUyrKZ1XzfGD/Puk6RKcv\ns9ijFORdc4orBa/us6Gz0ugP0Uk3WU8MQhfVmYrQPMO50iC3Gl/uLsT2EhSN2V4A\nWFtcGIn3qwRZK4fABR0kzqlLkCQ0R6AYzObJ2N0RmQKBgQDtoz00+jT3KqzYJ0bn\nXG9XyXtYaVb/pAZPmQ2ZSuLCmkcRxNpeGGwxU1rEEWGiXDgUr7gI/Ho/94l+KcDD\nNhbtBpg5Es4pNKCqhIRe8R4KNm6wM0PpEHDoaIXa2NI2UjzLFitCx8ysbpS7mSKD\nar3PWj/J451Jbf4kockN6tJFbwKBgQC/2EEvGUENJwkUIx+YyzGe2JGU5ZS1od1S\n/g74gJRyYkhRzqSGmB9ZFLpQwcUfeya+JcxI3SleoqGNBKmVlEBQFWY4OlZlYjUb\ncQlDGA3Xz+vytmIm9LBPV30aGVozA9R6QbB3nglh7jyI2CAhcGgwbqMFD24yijf0\nmqdetcvNPwKBgQDJN9EK+9Y/d/Y1bUSfgWiSV/vGiCPvgS8K1VlrdLp/92y4Qgx5\nYoqyVZdksCcQ+K9P7N6TVV4arfrRRn9/jFxrRYs9wIuq3nIxENaZIefC1AZz0mTt\ng0tnr6GwBqow7v+lI1dsS4wmcdgk5W0RBCBG5G9g/wfe9nEdCZUZ4L09pwKBgAc5\neZrwdIauRaVAfVwfqsq0lSbqTmNYqSEK+D1bejukf9y0z3VSHTwZj7qi0W2SEa9v\ndPX5filWLodE+a3sW0+ovqS3bbF7tUxHQXYJXdwWtGf7fk7BQDJ8tPVapw7swf+o\noaCfjvLlKdptaShZN1M7l2AFaLz2f4zylgL3Dam5AoGBAKq8/YDl18j+Z66FmOrh\n3/rR4R5JwJ0PT5B6bTOc45uHMYd1hBOaPPTtB8Qe//xKcTn7dZuRDBmV0LhEcP0r\nMrqAGAINqd4KEict5+8NaCJ8pYhxkQCbk4vyM/ChYliOBhxzMZLDXIxoya3LnKvu\nbFQBAcEUXtx/HPVP9abHjPkx\n-----END PRIVATE KEY-----\n",

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
