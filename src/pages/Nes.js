// pages/nes.js
'use client';
import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import Net from "@/components/Net";

export default function NESPage({ depositersServer }) {
  const { theme } = useTheme();

  const [depositers, setDepositors] = useState(depositersServer || []);
  const [selectedId, setSelectedId] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [search, setSearch] = useState("");

  // Filter depositers based on search input
  const filteredDepositors = depositers.filter(d =>
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  // Load document (client-side)
  const loadDocument = async () => {
    if (!selectedId) return alert("Hitamo User.");
    try {
      const docRef = doc(db, "depositers", selectedId);
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
        const docRef = doc(db, "depositers", selectedId);
        await updateDoc(docRef, { nes: newNES });
        setSelectedData(prev => ({ ...prev, nes: newNES }));
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
        <h2>Depositors</h2>

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
          {filteredDepositors.map(d => (
            <option key={d.id} value={d.id}>{d.id}</option>
          ))}
        </select>
        <button onClick={loadDocument}>Show</button>
      </div>

      {selectedData && (
        <div className="tableWrapper">
          <table className="nesTable">
            <thead>
              <tr>
                
                
                <th>Plan</th>
                <th>NES</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                  <td>{selectedData.plan || "N/A"}</td>
                <td>{selectedData.nes || "N/A"}</td>
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
        /* Table wrapper for horizontal scroll on mobile */
        .tableWrapper {
          overflow-x: auto;
          width: 100%;
          margin-top: 20px;
        }
        .nesTable {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px; /* ensures scroll on small screens */
          box-shadow: var(--shadow-sm);
        }
        .nesTable th, .nesTable td {
          border: 1px solid var(--gray-300);
          padding: 10px;
          text-align: left;
          white-space: nowrap;
        }
        .nesTable th {
          background: var(--primary);
          color: var(--text-light);
          font-weight: bold;
        }
        .nesTable td {
          background: var(--bg-card);
          color: var(--foreground);
        }
        @media (max-width: 1024px) {
          .nesTable th, .nesTable td {
            font-size: 0.9rem;
            padding: 8px;
          }
        }
        @media (max-width: 768px) {
          .nesTable th, .nesTable td {
            font-size: 0.85rem;
            padding: 6px;
          }
          .giver {
            padding: 12px;
          }
        }
        @media (max-width: 480px) {
          .nesTable th, .nesTable td {
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
    const snapshot = await getDocs(collection(db, "depositers"));
    const depositers = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    return { props: { depositersServer: depositers } };
  } catch (err) {
    console.error("Error fetching depositers:", err);
    return { props: { depositersServer: [] } };
  }
}
