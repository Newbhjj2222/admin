'use client';

import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/components/firebase";
import { useTheme } from "@/components/theme";
import Net from "@/components/Net";

export default function Verse() {
  const { theme } = useTheme();
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVerses = async () => {
    try {
      const q = query(collection(db, "bible"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      setVerses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteVerse = async (id) => {
    if (!confirm("Uzi neza ko ushaka gusiba iyi verse?")) return;
    await deleteDoc(doc(db, "bible", id));
    loadVerses();
  };

  useEffect(() => {
    loadVerses();
  }, []);

  return (
    <div className="container">
      <Net />

      <h2>📖 Bible Verses</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Verse</th>
              <th>Text</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="3" className="center">Loading...</td>
              </tr>
            )}

            {!loading && verses.length === 0 && (
              <tr>
                <td colSpan="3" className="center">Nta verse ihari</td>
              </tr>
            )}

            {verses.map(v => (
              <tr key={v.id}>
                <td className="verse">{v.verse}</td>
                <td className="text">{v.text}</td>
                <td>
                  <button onClick={() => deleteVerse(v.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🎨 STYLES */}
      <style jsx>{`
        .container {
          padding: 16px;
          min-height: 100vh;
          background: var(--background);
          color: var(--foreground);
        }

        h2 {
          text-align: center;
          margin-bottom: 16px;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: var(--bg-card);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        th, td {
          padding: 12px;
          border-bottom: 1px solid var(--gray-300);
          vertical-align: top;
        }

        th {
          background: var(--primary);
          color: white;
          font-size: var(--text-sm);
          text-transform: uppercase;
        }

        .verse {
          font-weight: bold;
          color: var(--danger);
          white-space: nowrap;
        }

        .text {
          line-height: 1.6;
        }

        button {
          background: var(--danger);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
        }

        button:hover {
          opacity: 0.85;
        }

        .center {
          text-align: center;
          padding: 20px;
        }

        /* 📱 MOBILE */
        @media (max-width: 600px) {
          th, td {
            font-size: 13px;
          }

          .text {
            min-width: 260px;
          }
        }
      `}</style>
    </div>
  );
}
