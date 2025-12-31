"use client";

import { useEffect, useState } from "react";
import Net from "@/components/Net";
import { db } from "@/components/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const ref = doc(db, "userdate", "data");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          const list = Object.keys(data).map((key) => ({
            key,
            ...data[key],
          }));
          setUsers(list);
        }
      } catch (error) {
        console.error("Fetch users error:", error);
        alert("Habaye ikibazo cyo kubona users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🗑️ Delete user
  const handleDelete = async (user) => {
    if (!confirm("Ushaka gusiba uyu user burundu?")) return;

    try {
      const res = await fetch("/api/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          docKey: user.key,
        }),
      });

      const data = await res.json();

      // ❌ Auth delete failed → Firestore delete succeeded
      if (data.partial === true) {
        alert(
          "⚠️ User yasibwe muri Firestore gusa (Auth byanze):\n" +
            data.authError
        );
      }

      // ❌ All failed
      if (!res.ok || !data.success) {
        alert(
          "❌ Gusiba byanze:\n" + (data.error || data.message || "Unknown error")
        );
        return;
      }

      // ✅ Remove from UI
      setUsers((prev) => prev.filter((u) => u.key !== user.key));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Habaye ikibazo gikomeye cyo gusiba user");
    }
  };

  if (loading) return <Net />;

  return (
    <>
      <Net />

      <div className="page">
        <h2>Users</h2>

        {users.length === 0 ? (
          <p>Nta users zihari</p>
        ) : (
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Izina</th>
                  <th>Email</th>
                  <th>UID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.key}>
                    <td>{u.fName}</td>
                    <td>{u.email}</td>
                    <td className="uid">{u.uid}</td>
                    <td>
                      <button
                        className="deleteBtn"
                        onClick={() => handleDelete(u)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .page {
          margin-top: 70px;
          margin-bottom: 120px;
          padding: var(--space-lg);
        }

        h2 {
          color: var(--foreground);
          margin-bottom: var(--space-md);
        }

        .tableWrap {
          overflow-x: auto;
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: var(--space-sm);
          text-align: left;
          border-bottom: 1px solid var(--gray-300);
          color: var(--foreground);
        }

        th {
          background: var(--bg-muted);
          font-weight: 600;
        }

        .uid {
          font-size: 12px;
          color: var(--gray-600);
        }

        .deleteBtn {
          background: var(--danger);
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .deleteBtn:hover {
          opacity: 0.9;
        }

        @media (max-width: 600px) {
          th,
          td {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}
