import Net from "@/components/Net";
import { db } from "@/components/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";

export async function getServerSideProps() {
  const docRef = doc(db, "userdate", "data");
  const snap = await getDoc(docRef);

  let users = [];

  if (snap.exists()) {
    const data = snap.data();
    users = Object.keys(data).map((key) => ({
      key,
      ...data[key],
    }));
  }

  return {
    props: {
      users,
    },
  };
}

export default function UsersPage({ users }) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(users);
  const [editing, setEditing] = useState(null);

  const filtered = data.filter((u) =>
    `${u.email} ${u.fName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (user) => {
    if (!confirm("Ushaka gusiba uyu user burundu?")) return;

    await fetch("/api/delete-user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        docKey: user.key,
      }),
    });

    setData((prev) => prev.filter((u) => u.key !== user.key));
  };

  const handleSave = async () => {
    const ref = doc(db, "userdate", "data");

    await updateDoc(ref, {
      [editing.key]: {
        email: editing.email,
        fName: editing.fName,
        uid: editing.uid,
      },
    });

    setData((prev) =>
      prev.map((u) => (u.key === editing.key ? editing : u))
    );
    setEditing(null);
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
                      <button
                        className="edit"
                        onClick={() => setEditing({ ...u })}
                      >
                        Edit
                      </button>
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

      {editing && (
        <div className="modal">
          <div className="modalBox">
            <h3>Edit User</h3>
            <input
              value={editing.fName}
              onChange={(e) =>
                setEditing({ ...editing, fName: e.target.value })
              }
              placeholder="Izina"
            />
            <input
              value={editing.email}
              onChange={(e) =>
                setEditing({ ...editing, email: e.target.value })
              }
              placeholder="Email"
            />

            <div className="modalBtns">
              <button onClick={() => setEditing(null)}>Cancel</button>
              <button className="save" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CSS ===== */}
      <style jsx>{`
/* Wrapper na search */
.wrapper {
  margin-top: 70px;
  margin-bottom: 120px;
  padding: var(--space-lg);
  background: var(--background);
  color: var(--foreground);
  min-height: 100vh;
}

.wrapper h1 {
  margin-bottom: var(--space-md);
  font-size: var(--text-2xl);
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

/* Table responsive */
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

th, td {
  padding: 12px;
  border-bottom: 1px solid var(--gray-300);
  text-align: left;
}

th {
  background: var(--bg-light);
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

.edit {
  background: var(--primary);
  color: var(--text-light);
  margin-right: 6px;
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

/* =========================
   MODAL & OVERLAY
========================= */
.modal {
  position: fixed;        /* floating hejuru yibindi */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;          /* center modalBox */
  align-items: center;    /* vertical center */
  justify-content: center; /* horizontal center */
  background: var(--bg-overlay); /* overlay */
  z-index: 9999;          /* hejuru ya byose */
}

.modalBox {
  background: var(--background);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  animation: modalIn 0.3s ease-out;
}

.modalBox input {
  width: 100%;
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--gray-300);
  background: var(--bg-card);
  color: var(--foreground);
  font-family: var(--font-sans);
}

.modalBtns {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
}

.modalBtns .save {
  background: var(--primary);
  color: var(--text-light);
}

.modalBtns button {
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
}

/* Modal animation */
@keyframes modalIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 768px) {
  th, td {
    padding: 8px;
    font-size: 0.9rem;
  }

  .modalBox {
    padding: var(--space-md);
  }

  .modalBox input {
    padding: var(--space-xs);
  }
}

@media (max-width: 480px) {
  .search {
    max-width: 100%;
  }

  .modalBox {
    width: 90%;
    padding: var(--space-md);
  }
        }
      `}</style>
    </>
  );
}
