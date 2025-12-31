'use client';

import React, { useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/components/firebase";
import { useTheme } from "@/components/theme";

/* ======================
   🧩 PAGE
====================== */
export default function Team({ members }) {
  const { theme } = useTheme();
  const [team, setTeam] = useState(members);

  /* ======================
     🗑️ DELETE MEMBER
  ====================== */
  const deleteMember = async (id) => {
    if (!confirm("Urashaka gusiba uyu muntu?")) return;

    await deleteDoc(doc(db, "Team", id));
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="container">
      

      <h1>Team Members</h1>

      {team.length === 0 && (
        <p className="empty">Nta Team Member iboneka</p>
      )}

      {/* 🧑‍🤝‍🧑 TEAM LIST */}
      <div className="grid">
        {team.map((m) => (
          <div className="card" key={m.id}>
            <img src={m.photo} alt={m.name} />

            <div className="info">
              <h3>{m.name}</h3>

              {m.whatsapp && (
                <a
                  href={`https://wa.me/${m.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                >
                  {m.whatsapp}
                </a>
              )}
            </div>

            <button onClick={() => deleteMember(m.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* 🎨 STYLES */}
      <style jsx>{`
        .container {
          margin-top: 50px;
          margin-bottom: 120px;
          padding: 16px;
          min-height: 100vh;
          background: var(--background);
          color: var(--foreground);
          font-family: var(--font-sans);
        }

        h1 {
          text-align: center;
          margin-bottom: 24px;
        }

        .empty {
          text-align: center;
          opacity: 0.7;
        }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }

        /* CARD */
        .card {
          background: var(--bg-card);
          border-radius: 14px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: var(--shadow-sm);
        }

        .card img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary);
        }

        .info {
          flex: 1;
        }

        .info h3 {
          margin: 0;
          font-size: 1rem;
        }

        .info a {
          font-size: 0.85rem;
          color: #25d366;
          text-decoration: none;
        }

        .info a:hover {
          text-decoration: underline;
        }

        /* BUTTON */
        button {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        button:hover {
          opacity: 0.9;
        }

        /* MOBILE */
        @media (max-width: 600px) {
          .card {
            flex-direction: column;
            text-align: center;
          }

          button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

/* ======================
   🌍 SSR
====================== */
export async function getServerSideProps() {
  const snap = await getDocs(collection(db, "Team"));

  const members = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return {
    props: { members },
  };
}
