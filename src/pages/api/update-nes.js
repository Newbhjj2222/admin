import { db } from "@/components/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { user, nes } = req.body;

    if (!user || !nes) {
      return res.status(400).json({ message: "Missing user or nes" });
    }

    await updateDoc(doc(db, "depositers", user), {
      nes: Number(nes),
    });

    return res.status(200).json({ message: "NES updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update failed" });
  }
}
