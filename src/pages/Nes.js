// pages/nes.js
import React, { useState, useEffect } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import Net from "@/components/Net";

export default function NESPage({ depositersServer }) {
  const { theme } = useTheme();

  const [depositers, setDepositors] = useState(depositersServer || []);
  const [search, setSearch] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  // Filter depositers by search input
  useEffect(() => {
    if (!search.trim()) {
      setSelectedData(null);
      return;
    }
    const matched = depositers.find(d =>
      d.id.toLowerCase().includes(search.toLowerCase())
    );
    setSelectedData(matched || null);
  }, [search, depositers]);

  // Update NES
  const updateNES = async () => {
    if (!selectedData) return alert("Hitamo user mbere yo kuvugurura NES.");
    const newNES = prompt("Shyiramo agaciro gashya ka NES:", selectedData.nes || "");
    if (!newNES || !newNES.trim()) return;
    try {
      const docRef = doc(db, "depositers", selectedData.id);
      await updateDoc(docRef, { nes: newNES });
      setSelectedData(prev => ({ ...prev, nes: newNES }));
      alert("NES yavuguruwe neza!");
    } catch (err) {
      console.error(err);
      alert("Habaye ikosa mu kuvugurura NES.");
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
      </div>

      {selectedData && (
        <table className="nesTable">
          <thead>
            <tr>
              <th>Username</th>
              <th>Phone</th>
              <th>Momo Name</th>
              <th>Plan</th>
              <th>NES</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{selectedData.names || "N/A"}</td>
              <td>{selectedData.phone || "N/A"}</td>
              <td>{selectedData.momo_name || "N/A"}</td>
              <td>{selectedData.plan || "N/A"}</td>
              <td>{selectedData.nes || "N/A"}</td>
              <td>{selectedData.timestamp ? selectedData.timestamp.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'long' }) : "N/A"}</td>
              <td>
                <button onClick={updateNES}>Update NES</button>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <style jsx>{`
        .container {
          padding: 20px;
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
        .searchInput {
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--gray-300);
          font-size: var(--text-base);
          background: var(--bg-card);
          color: var(--foreground);
          width: 100%;
          max-width: 300px;
        }
        .nesTable {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .nesTable th, .nesTable td {
          border: 1px solid var(--gray-300);
          padding: 10px;
          text-align: left;
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
        @media (max-width: 768px) {
          .nesTable th, .nesTable td {
            font-size: 0.8rem;
            padding: 6px;
          }
          .giver {
            padding: 12px;
          }
        }
        @media (max-width: 480px) {
          .nesTable {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
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
