"use client";

import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import { FaShieldAlt, FaCheck } from "react-icons/fa";
import styles from "@/styles/moni.module.css";

export default function Monetize({ initialAuthors }) {
  const { theme } = useTheme();
  const [authors, setAuthors] = useState(initialAuthors || []);

  // ======================
  // 🔄 Update status
  // ======================
  const updateAuthorStatus = async (authorId, newStatus) => {
    try {
      await updateDoc(doc(db, "authors", authorId), {
        status: newStatus,
      });

      setAuthors((prev) =>
        prev.map((author) =>
          author.id === authorId
            ? { ...author, status: newStatus }
            : author
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className={styles.container} data-theme={theme}>
      <h2 className={styles.title}>ABANDITSI BARI MONETIZE</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Author</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {authors.length === 0 && (
              <tr>
                <td colSpan="3" className={styles.empty}>
                  Nta authors babonetse
                </td>
              </tr>
            )}

            {authors.map((author) => (
              <tr key={author.id} className={styles.tr}>
                {/* Author */}
                <td className={styles.td}>{author.id}</td>

                {/* Status */}
                <td className={`${styles.td} ${styles.status}`}>
                  {author.status === "Monitized" ? (
                    <span className={styles.monetized}>
                      Monitized
                      <span className={styles.shield}>
                        <FaShieldAlt />
                        <FaCheck className={styles.check} />
                      </span>
                    </span>
                  ) : (
                    <span className={styles.nonMonetized}>
                      Non-Monetized
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className={styles.td}>
                  <button
                    className={styles.allow}
                    onClick={() =>
                      updateAuthorStatus(author.id, "Monitized")
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

    const initialAuthors = snap.docs.map((doc) => ({
      id: doc.id,
      status: doc.data().status || "Non-Monetized",
    }));

    return {
      props: { initialAuthors },
    };
  } catch (error) {
    console.error("Error fetching authors:", error);
    return {
      props: { initialAuthors: [] },
    };
  }
}
