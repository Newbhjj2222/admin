import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useState } from "react";
import styles from "@/styles/nes.module.css";

export default function NESPage({
  depositers,
  selectedId,
  selectedData,
}) {
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const user = formData.get("user");
    const nes = formData.get("nes");

    try {
      const res = await fetch("/api/update-nes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, nes }),
      });

      const data = await res.json();
      setMessage(data.message);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage("Error updating NES");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.giver}>
        <h1>Management of NES</h1>

        {message && <p className={styles.message}>{message}</p>}

        {/* SEARCH + SELECT */}
        <form method="GET" className={styles.formRow}>
          <input
            type="text"
            name="search"
            placeholder="Shaka username..."
            className={styles.searchInput}
          />

          <select
            name="user"
            defaultValue={selectedId || ""}
            className={styles.documentSelect}
          >
            <option value="">Hitamo User</option>
            {depositers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id}
              </option>
            ))}
          </select>

          <button type="submit" className={styles.btn}>
            Show
          </button>
        </form>
      </div>

      {/* TABLE */}
      {selectedData && (
        <div className={styles.tableWrapper}>
          <table className={styles.nesTable}>
            <thead>
              <tr>
                <th>Plan</th>
                <th>NES</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedData.plan || "N/A"}</td>
                <td>{selectedData.nes || "N/A"}</td>
                <td>{selectedData.time || "N/A"}</td>
                <td>
                  <form onSubmit={handleUpdate} className={styles.inlineForm}>
                    <input type="hidden" name="user" value={selectedId} />
                    <input
                      type="number"
                      name="nes"
                      placeholder="New NES"
                      required
                      className={styles.input}
                    />
                    <button type="submit" className={styles.btn}>
                      Update
                    </button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ================== SSR ==================
export async function getServerSideProps(context) {
  const { query } = context;
  const selectedId = query.user || null;
  const search = query.search || "";

  let depositers = [];

  try {
    const snap = await getDocs(collection(db, "depositers"));
    depositers = snap.docs.map((d) => ({ id: d.id }));
  } catch (err) {
    console.error(err);
  }

  if (search) {
    depositers = depositers.filter((d) =>
      d.id.toLowerCase().includes(search.toLowerCase())
    );
  }

  let selectedData = null;

  if (selectedId) {
    try {
      const d = await getDoc(doc(db, "depositers", selectedId));

      if (d.exists()) {
        const data = d.data();

        let formattedTime = null;

        if (data.time) {
          if (typeof data.time.toDate === "function") {
            formattedTime = data.time.toDate().toLocaleDateString("en-GB");
          } else {
            formattedTime = new Date(data.time).toLocaleDateString("en-GB");
          }
        }

        selectedData = {
          ...data,
          time: formattedTime,
        };
      }
    } catch (err) {
      console.error(err);
    }
  }

  return {
    props: {
      depositers,
      selectedId,
      selectedData,
    },
  };
}
