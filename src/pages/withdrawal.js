// pages/withdrawal.js
'use client';

import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import styles from "@/styles/Withdrawal.module.css";

export default function WithdrawalPage({ withdrawersServer }) {
  const { theme } = useTheme();
  const [withdrawers, setWithdrawers] = useState(withdrawersServer || []);
  const [selectedId, setSelectedId] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [search, setSearch] = useState("");

  // Filter withdrawers by search
  const filteredWithdrawers = withdrawers.filter(w =>
    w.id.toLowerCase().includes(search.toLowerCase())
  );

  // Load selected withdrawer
  const loadDocument = async () => {
    if (!selectedId) return alert("Hitamo User.");
    try {
      const docRef = doc(db, "withdrawers", selectedId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSelectedData(docSnap.data());
      } else {
        alert("Document not found!");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching document.");
    }
  };

  // Update NES
  const updateNES = async () => {
    if (!selectedId) return alert("Hitamo user mbere yo kuvugurura NES.");
    const newNES = prompt("Shyiramo agaciro gashya ka NES:");
    if (newNES !== null && newNES.trim() !== "") {
      try {
        const docRef = doc(db, "withdrawers", selectedId);
        await updateDoc(docRef, { nesRequested: Number(newNES) });
        setSelectedData(prev => ({ ...prev, nesRequested: Number(newNES) }));
        alert("NES yavuguruwe neza!");
      } catch (err) {
        console.error(err);
        alert("Habaye ikosa mu kuvugurura NES.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.giver}>
        <h1>Management of NES</h1>
        <h2>Withdrawers</h2>

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
          {filteredWithdrawers.map(w => (
            <option key={w.id} value={w.id}>{w.id}</option>
          ))}
        </select>
        <button onClick={loadDocument}>Show</button>
      </div>

      {selectedData && (
        <div className={styles.tableWrapper}>
          <table className={styles.withdrawalTable}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Phone</th>
                <th>NES Requested</th>
                <th>Total NES</th>
                <th>RWF Value</th>
                <th>Status</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedData.username || "N/A"}</td>
                <td>{selectedData.phone || "N/A"}</td>
                <td>{selectedData.nesRequested || "N/A"}</td>
                <td>{selectedData.nesTotal || "N/A"}</td>
                <td>{selectedData.rwfValue || "N/A"}</td>
                <td>{selectedData.status || "Pending"}</td>
                <td>
                  {selectedData.createdAt?.toDate
                    ? selectedData.createdAt.toDate().toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  <button onClick={updateNES}>Update NES</button>
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
    const snapshot = await getDocs(collection(db, "withdrawers"));
    const withdrawers = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    return { props: { withdrawersServer: withdrawers } };
  } catch (err) {
    console.error("Error fetching withdrawers:", err);
    return { props: { withdrawersServer: [] } };
  }
}
