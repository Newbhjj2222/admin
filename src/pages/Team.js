'use client';

import React, { useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/components/firebase";
import { useTheme } from "@/components/theme";
import styles from "@/styles/team.module.css";

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
    <div className={styles.container}>
      <h1 className={styles.title}>Team Members</h1>

      {team.length === 0 && (
        <p className={styles.empty}>Nta Team Member iboneka</p>
      )}

      {/* 🧑‍🤝‍🧑 TEAM LIST */}
      <div className={styles.grid}>
        {team.map((m) => (
          <div className={styles.card} key={m.id}>
            <img
              src={m.photo}
              alt={m.name}
              className={styles.avatar}
            />

            <div className={styles.info}>
              <h3 className={styles.name}>{m.name}</h3>

              {m.whatsapp && (
                <a
                  href={`https://wa.me/${m.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.whatsapp}
                >
                  {m.whatsapp}
                </a>
              )}
            </div>

            <button
              onClick={() => deleteMember(m.id)}
              className={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
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
