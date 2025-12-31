import Net from "@/components/Net";
import { db } from "@/components/firebase";
import { doc } from "firebase/firestore";
import { useState } from "react";

export async function getServerSideProps() {
  const snap = await db.collection("userdate").doc("data").get();
  let users = [];
  if (snap.exists) {
    const data = snap.data();
    users = Object.keys(data).map((key) => ({
      key,
      ...data[key],
    }));
  }

  return {
    props: { users },
  };
}

export default function UsersPage({ users }) {
  const [data, setData] = useState(users);
  const [search, setSearch] = useState("");

  const filtered = data.filter((u) =>
    `${u.email} ${u.fName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (user) => {
    if (!confirm("Ushaka gusiba uyu user burundu?")) return;

    await fetch("/api/delete-user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: user.uid, docKey: user.key }),
    });

    setData((prev) => prev.filter((u) => u.key !== user.key));
  };

  return (
    <>
      <Net />
      <div className="wrapper">
        <h1>Abakoresha (Users)</h1>
        <input
          className="search"
          placeholder="Shakisha user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Izina</th>
                <th>Email</th>
                <th>UID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((u) => (
                  <tr key={u.key}>
                    <td>{u.fName}</td>
                    <td>{u.email}</td>
                    <td className="uid">{u.uid}</td>
                    <td>
                      <button className="delete" onClick={() => handleDelete(u)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty">
                    Nta user wabonetse
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          margin-top: 70px;
          margin-bottom: 120px;
          padding: var(--space-lg);
          background: var(--background);
          color: var(--foreground);
          min-height: 100vh;
        }

        h1 {
          margin-bottom: var(--space-md);
          font-size: var(--text-2xl);
          text-align: center;
        }

        .search {
          width: 100%;
          max-width: 360px;
          padding: var(--space-sm);
          border-radius: var(--radius-sm);
          border: 1px solid var(--gray-300);
          margin-bottom: var(--space-md);
          background: var(--bg-card);
          color: var(--foreground);
        }

        .tableWrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: var(--bg-card);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
        }

        th,
        td {
          padding: 12px;
          border-bottom: 1px solid var(--gray-300);
          text-align: left;
        }

        th {
          background: var(--bg-card);
          color: var(--foreground);
        }

        .uid {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        button {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
        }

        .delete {
          background: var(--danger);
          color: var(--text-light);
        }

        .empty {
          text-align: center;
          padding: 16px;
          opacity: 0.6;
        }

        @media (max-width: 768px) {
          th,
          td {
            padding: 8px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .search {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}
