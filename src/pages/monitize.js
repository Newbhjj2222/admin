import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import styles from "@/styles/moni.module.css";

export default function Monetize({ initialAuthors }) {
  const { theme } = useTheme();
  const [authors, setAuthors] = useState(initialAuthors || []);

  const updateAuthorStatus = async (authorId, newStatus) => {
    try {
      await updateDoc(doc(db, "authors", authorId), { status: newStatus });
      setAuthors((prev) =>
        prev.map((a) =>
          a.id === authorId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ABANDITSI BARI MONETIZE</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Authors</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {authors.length === 0 && (
              <tr>
                <td colSpan="3" className={styles.empty}>
                  Nta authors bibonetse
                </td>
              </tr>
            )}

            {authors.map((author) => (
              <tr key={author.id} className={styles.tr}>
                <td className={styles.td}>{author.id}</td>
                <td className={`${styles.td} ${styles.status}`}>
                  {author.status}
                </td>
                <td className={styles.td}>
                  <button
  className={styles.allow}
  onClick={() =>
    updateAuthorStatus(author.id, "Monetized factcheckershelide")
  }
>
  Allow
</button>

                  <button
                    className={styles.disallow}
                    onClick={() =>
                      updateAuthorStatus(author.id, "Non-Monetized")
                    }
                  >
                    Disallow
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ======================
// 🌍 SSR
// ======================
export async function getServerSideProps() {
  try {
    const snap = await getDocs(collection(db, "authors"));
    const initialAuthors = snap.docs.map((d) => ({
      id: d.id,
      status: d.data().status || "Pending",
    }));

    return { props: { initialAuthors } };
  } catch (err) {
    console.error("Error fetching authors:", err);
    return { props: { initialAuthors: [] } };
  }
}
