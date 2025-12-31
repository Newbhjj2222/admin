"use client";

import { useEffect, useState } from "react";
import Net from "@/components/Net";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/get-users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Fetch users error:", error);
        alert("Habaye ikibazo cyo kubona users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) =>
    `${u.email} ${u.fName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (user) => {
    if (!confirm(`Ushaka gusiba user ${user.fName} burundu?`)) return;

    try {
      const res = await fetch("/api/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, docKey: user.key }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || data.message || "Gusiba byanze");
        return;
      }

      if (data.partial) {
        alert(
          `⚠️ User yasibwe muri Firestore gusa (Auth byanze): ${data.authError}`
        );
      }

      setUsers((prev) => prev.filter((u) => u.key !== user.key));
    } catch (error) {
      console.error(error);
      alert("Habaye ikibazo cyo gusiba user");
    }
  };

  if (loading) return <Net />;

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
                      <button
                        className="delete"
                        onClick={() => handleDelete(u)}
                      >
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
          text-align: center;
        }
        .search {
          width: 100%;
          max-width: 360px;
          padding: var(--space-sm);
          border-radius: var(--radius-sm);
          border: 1px solid var(--gray-300);
          margin: 0 auto var(--space-md);
          display: block;
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
          text-align: left;
          border-bottom: 1px solid var(--gray-300);
          color: var(--foreground);
        }
        th {
          background: var(--bg-card);
        }
        .uid {
          font-size: 0.85rem;
          opacity: 0.7;
        }
        .delete {
          background: var(--danger);
          color: var(--text-light);
          padding: 6px 12px;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .empty {
          text-align: center;
          padding: 16px;
          opacity: 0.6;
        }
      `}</style>
    </>
  );
}
