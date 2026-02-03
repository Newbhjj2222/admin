'use client';

import React, { useState } from "react";
import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useTheme } from "@/components/theme";
import styles from "@/styles/Withdrawal.module.css";

export default function WithdrawalPage({ withdrawersServer }) {
  const { theme } = useTheme();
  const [withdrawers, setWithdrawers] = useState(withdrawersServer || []);
  const [selectedId, setSelectedId] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [search, setSearch] = useState("");

  // ================= FILTER =================
  const filteredWithdrawers = withdrawers.filter((w) =>
    w.id.toLowerCase().includes(search.toLowerCase())
  );

  // ================= LOAD SELECTED DOCUMENT =================
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

  // ================= UPDATE NES REQUESTED =================
  const updateNES = async () => {
    if (!selectedId) return alert("Hitamo user mbere yo kuvugurura NES.");
    const newNES = prompt("Shyiramo agaciro gashya ka NES:");
    if (newNES !== null && newNES.trim() !== "") {
      try {
        const docRef = doc(db, "withdrawers", selectedId);
        await updateDoc(docRef, { nesRequested: Number(newNES) });
        setSelectedData((prev) => ({ ...prev, nesRequested: Number(newNES) }));
        alert("NES yavuguruwe neza!");
      } catch (err) {
        console.error(err);
        alert("Habaye ikosa mu kuvugurura NES.");
      }
    }
  };

  // ================= APPROVE REQUEST =================
  const approveRequest = async () => {
    if (!selectedId) return alert("Hitamo user mbere yo guhindura status.");
    if (selectedData.withdrawStatus === "approved")
      return alert("Request yamaze kwemezwa.");

    try {
      const withdrawRef = doc(db, "withdrawers", selectedId);
      const authorRef = doc(db, "authors", selectedData.username);

      // Fata NES iriho kuri author
      const authorSnap = await getDoc(authorRef);
      if (!authorSnap.exists()) return alert("Author document ntiboneka");

      const authorData = authorSnap.data();
      const nesBefore = Number(authorData.nes || 0);

      if (nesBefore < selectedData.nesRequested) {
        return alert(
          `NES kuri author ni ${nesBefore}, ntabwo bishoboka gukura ${selectedData.nesRequested}`
        );
      }

      const nesAfter = nesBefore - selectedData.nesRequested;

      // 1️⃣ Gabanya NES kuri author
      await updateDoc(authorRef, {
        nes: nesAfter,
        updatedAt: serverTimestamp(),
      });

      // 2️⃣ Hindura status ya withdraw request na snapshot ya nesAfter
      await updateDoc(withdrawRef, {
        withdrawStatus: "approved",
        approvedAt: serverTimestamp(),
        nesAfter,
      });

      // 3️⃣ Update local state
      setSelectedData((prev) => ({
        ...prev,
        withdrawStatus: "approved",
        nesAfter,
      }));

      alert(`Request yemerewe! NES isigaye kuri author: ${nesAfter}`);
    } catch (err) {
      console.error(err);
      alert("Habaye ikosa mu kwemeza request.");
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
          {filteredWithdrawers.map((w) => (
            <option key={w.id} value={w.id}>
              {w.id}
            </option>
          ))}
        </select>
        <button className={styles.btn} onClick={loadDocument}>
          Show
        </button>
      </div>

      {selectedData && (
        <div className={styles.tableWrapper}>
          <table className={styles.withdrawalTable}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Phone</th>
                <th>NES Requested</th>
                <th>Total NES (Before)</th>
                <th>NES After</th>
                <th>RWF Value</th>
                <th>Request Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedData.username || "N/A"}</td>
                <td>{selectedData.phone || "N/A"}</td>
                <td>{selectedData.nesRequested || "N/A"}</td>
                <td>{selectedData.nesBefore || "N/A"}</td>
                <td>{selectedData.nesAfter ?? "Pending"}</td>
                <td>{selectedData.rwfRequested || "N/A"}</td>
                <td>{selectedData.withdrawStatus || "Pending"}</td>
                <td>
                  {selectedData.createdAt?.toDate
                    ? selectedData.createdAt.toDate().toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  <button className={styles.btn} onClick={updateNES}>
                    Update NES
                  </button>
                  <button
                    className={styles.btn}
                    onClick={approveRequest}
                    style={{ marginLeft: "8px" }}
                  >
                    Approve
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
    const snapshot = await getDocs(collection(db, "withdrawers"));
    const withdrawers = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return { props: { withdrawersServer: withdrawers } };
  } catch (err) {
    console.error("Error fetching withdrawers:", err);
    return { props: { withdrawersServer: [] } };
  }
}
