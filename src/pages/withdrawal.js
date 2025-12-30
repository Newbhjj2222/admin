// pages/withdrawal.js
'use client';
import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import Net from "@/components/Net";

export default function WithdrawalPage({ withdrawersServer }) {
  const { theme } = useTheme();

  const [withdrawers, setWithdrawers] = useState(withdrawersServer || []);
  const [selectedId, setSelectedId] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [search, setSearch] = useState("");

  // Filter withdrawers
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

  // Update NES (amount)
  const updateNES = async () => {
    if (!selectedId) return alert("Hitamo user mbere yo kuvugurura NES.");
    const newNES = prompt("Shyiramo agaciro gashya ka NES:");
    if (newNES !== null && newNES.trim() !== "") {
      try {
        const docRef = doc(db, "withdrawers", selectedId);
        await updateDoc(docRef, { amount: newNES });
        setSelectedData(prev => ({ ...prev, amount: newNES }));
        alert("NES yavuguruwe neza!");
      } catch (err) {
        console.error(err);
        alert("Habaye ikosa mu kuvugurura NES.");
      }
    }
  };

  return (
    <div className="container">
      <Net />
      <div className="giver">
        <h1>Management of NES</h1>
        <h2>Withdrawers</h2>

        <input
          type="text"
          placeholder="Shaka username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="searchInput"
        />

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="documentSelect"
        >
          <option value="">Hitamo User</option>
          {filteredWithdrawers.map(w => (
            <option key={w.id} value={w.id}>{w.id}</option>
          ))}
        </select>
        <button onClick={loadDocument}>Show</button>
      </div>

      {selectedData && (
        <div className="tableWrapper">
          <table className="withdrawalTable">
            <thead>
              <tr>
                <th>Username</th>
                <th>Phone</th>
                <th>NES</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedData.ame || "N/A"}</td>
                <td>{selectedData.fone || "N/A"}</td>
                <td>{selectedData.amount || "N/A"}</td>
                <td>
                  {selectedData.timestamp
                    ? selectedData.timestamp.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })
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

      <style jsx>{`
        .container {
          padding: 20px;
          margin-top: 70px;
          background: var(--background);
          color: var(--foreground);
          font-family: var(--font-sans);
          min-height: 100vh;
        }
        .giver {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          background: var(--bg-card);
          padding: 16px;
          border-radius: var(--radius-lg);
          margin-bottom: 20px;
          box-shadow: var(--shadow-md);
        }
        .documentSelect, .searchInput {
          padding: 6px 10px;
          margin: 4px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--gray-300);
          font-size: var(--text-base);
          background: var(--bg-card);
          color: var(--foreground);
        }
        button {
          padding: 6px 12px;
          border: none;
          border-radius: var(--radius-sm);
          background: var(--primary);
          color: var(--text-light);
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover {
          background: var(--primary-dark);
        }
        .tableWrapper {
          overflow-x: auto;
          width: 100%;
          margin-top: 20px;
        }
        .withdrawalTable {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
          box-shadow: var(--shadow-sm);
        }
        .withdrawalTable th, .withdrawalTable td {
          border: 1px solid var(--gray-300);
          padding: 10px;
          text-align: left;
          white-space: nowrap;
        }
        .withdrawalTable th {
          background: var(--primary);
          color: var(--text-light);
          font-weight: bold;
        }
        .withdrawalTable td {
          background: var(--bg-card);
          color: var(--foreground);
        }
        @media (max-width: 1024px) {
          .withdrawalTable th, .withdrawalTable td {
            font-size: 0.9rem;
            padding: 8px;
          }
        }
        @media (max-width: 768px) {
          .withdrawalTable th, .withdrawalTable td {
            font-size: 0.85rem;
            padding: 6px;
          }
          .giver {
            padding: 12px;
          }
        }
        @media (max-width: 480px) {
          .withdrawalTable th, .withdrawalTable td {
            font-size: 0.8rem;
            padding: 4px;
          }
        }
      `}</style>
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
