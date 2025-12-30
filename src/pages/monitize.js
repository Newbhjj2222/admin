import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import Net from "@/components/Net";

export default function Monetize({ initialAuthors }) {
  const { theme } = useTheme();
  const [authors, setAuthors] = useState(initialAuthors || []);

  const updateAuthorStatus = async (authorId, newStatus) => {
    try {
      await updateDoc(doc(db, "authors", authorId), { status: newStatus });
      setAuthors((prev) =>
        prev.map((a) => (a.id === authorId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="container">
      <Net />
      <h2>ABANDITSI BARI MONETIZE</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Authors</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>Nta authors bibonetse</td>
              </tr>
            )}
            {authors.map((author) => (
              <tr key={author.id}>
                <td>{author.id}</td>
                <td className="status">{author.status}</td>
                <td>
                  <button
                    className="allow"
                    onClick={() => updateAuthorStatus(author.id, "Monetized💲")}
                  >
                    Allow
                  </button>
                  <button
                    className="disallow"
                    onClick={() => updateAuthorStatus(author.id, "Non-Monetized")}
                  >
                    Disallow
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .container {
          margin-top: 60px;
          margin-bottom: 120px;
          padding: 16px;
          min-height: 100vh;
          background: var(--background);
          color: var(--foreground);
          font-family: var(--font-sans);
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: var(--bg-card);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        th, td {
          padding: 12px 15px;
          border-bottom: 1px solid var(--gray-200);
          text-align: left;
        }

        th {
          background: var(--primary);
          color: white;
          text-transform: uppercase;
        }

        .status {
          font-weight: bold;
        }

        button {
          padding: 6px 12px;
          border: none;
          border-radius: 5px;
          margin-right: 8px;
          cursor: pointer;
          color: white;
        }

        .allow {
          background-color: #28a745;
        }
        .allow:hover {
          background-color: #218838;
        }

        .disallow {
          background-color: #dc3545;
        }
        .disallow:hover {
          background-color: #c82333;
        }

        @media (max-width: 600px) {
          table, th, td {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

// ======================
// 🌍 SSR: Kuzana authors ku server
// ======================
export async function getServerSideProps() {
  try {
    const snap = await getDocs(collection(db, "authors"));
    const initialAuthors = snap.docs.map(d => ({
      id: d.id,
      status: d.data().status || "Pending",
    }));

    return { props: { initialAuthors } };
  } catch (err) {
    console.error("Error fetching authors:", err);
    return { props: { initialAuthors: [] } };
  }
}
