import Net from "@/components/Net";
import { db } from "@/components/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ChangePage() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const router = useRouter();

  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (!key) return;

    const fetchUser = async () => {
      const ref = doc(db, "userdate", "data");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data[key]) setEditing({ key, ...data[key] });
      }
    };
    fetchUser();
  }, [key]);

  const handleSave = async () => {
    if (!editing) return;
    const ref = doc(db, "userdate", "data");
    await updateDoc(ref, {
      [editing.key]: {
        email: editing.email,
        fName: editing.fName,
        uid: editing.uid,
      },
    });
    alert("User updated!");
    router.push("/user");
  };

  if (!editing) return <Net />;

  return (
    <>
      <Net />

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
            <button onClick={() => router.push("/user")}>Cancel</button>
            <button className="save" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-overlay);
          z-index: 9999;
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

        @media (max-width: 480px) {
          .modalBox {
            width: 90%;
            padding: var(--space-md);
          }
          .modalBox input {
            padding: var(--space-xs);
          }
        }
      `}</style>
    </>
  );
}
