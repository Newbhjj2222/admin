'use client';

import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import styles from "@/styles/reward.module.css";

export default function RewardsPage({ authorsServer }) {
  const { theme } = useTheme();

  const [authors, setAuthors] = useState(authorsServer || []);
  const [selectedId, setSelectedId] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [search, setSearch] = useState("");

  const filteredAuthors = authors.filter((a) =>
    a.id.toLowerCase().includes(search.toLowerCase())
  );

  const loadDocument = async () => {
    if (!selectedId) return alert("Hitamo User.");
    try {
      const snap = await getDoc(doc(db, "authors", selectedId));
      if (snap.exists()) {
        setSelectedData(snap.data());
      } else {
        alert("Document not found!");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching document.");
    }
  };

  const updateNES = async () => {
    if (!selectedId) return alert("Hitamo user mbere yo kuvugurura NES.");
    const newNES = prompt("Shyiramo agaciro gashya ka NES:");
    if (!newNES) return;

    try {
      await updateDoc(doc(db, "authors", selectedId), { nes: newNES });
      setSelectedData((prev) => ({ ...prev, nes: newNES }));
      alert("NES yavuguruwe neza!");
    } catch (err) {
      console.error(err);
      alert("Habaye ikosa mu kuvugurura NES.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.giver}>
        <h1 className={styles.title}>Management of NES</h1>
        <h2 className={styles.subtitle}>Rewards</h2>

        <input
          type="text"
          placeholder="Shaka username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className={styles.documentSelect}
        >
          <option value="">Hitamo User</option>
          {filteredAuthors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.id}
            </option>
          ))}
        </select>

        <button className={styles.primaryBtn} onClick={loadDocument}>
          Show
        </button>
      </div>

      {selectedData && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>NES</th>
                <th className={styles.th}>Time</th>
                <th className={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.td}>{selectedData.nes || "N/A"}</td>
                <td className={styles.td}>
                  {selectedData.timestamp
                    ? selectedData.timestamp
                        .toDate()
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                        })
                    : "N/A"}
                </td>
                <td className={styles.td}>
                  <button
                    className={styles.updateBtn}
                    onClick={updateNES}
                  >
                    Update NES
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ================= SSR =================
export async function getServerSideProps() {
  try {
    const snap = await getDocs(collection(db, "authors"));
    const authorsServer = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return { props: { authorsServer } };
  } catch (err) {
    console.error("Error fetching authors:", err);
    return { props: { authorsServer: [] } };
  }
}
