
// pages/nes.js
import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import styles from "@/styles/nes.module.css";

export default function NESPage({
  depositers,
  selectedId,
  selectedData,
  message,
}) {
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
                  <form method="POST" className={styles.inlineForm}>
                    <input type="hidden" name="user" value={selectedId} />
                    <input
                      type="text"
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

// ================== SSR for NES page ==================
export async function getServerSideProps(context) {
  const { query } = context;
  const selectedId = query.user || null;
  const search = query.search || "";
  let message = null;

  // FETCH ALL DEPOSITERS
  let depositers = [];
  try {
    const snap = await getDocs(collection(db, "depositers"));
    depositers = snap.docs.map((d) => ({ id: d.id }));
  } catch (err) {
    console.error("Error fetching depositers:", err);
  }

  if (search) {
    depositers = depositers.filter(d =>
      d.id.toLowerCase().includes(search.toLowerCase())
    );
  }

  // FETCH SELECTED USER
  let selectedData = null;
  if (selectedId) {
    try {
      const d = await getDoc(doc(db, "depositers", selectedId));
      if (d.exists()) {
        const data = d.data();

        // SAFE TIME FORMATTING (serverTimestamp na string/number)
        let formattedTime = null;
        if (data.time) {
          if (typeof data.time.toDate === "function") {
            formattedTime = data.time.toDate().toLocaleDateString("en-GB");
          } else if (typeof data.time === "string" || typeof data.time === "number") {
            formattedTime = new Date(data.time).toLocaleDateString("en-GB");
          }
        }

        selectedData = {
          ...data,
          time: formattedTime,
        };
      }
    } catch (err) {
      console.error("Error fetching selected user:", err);
    }
  }

  return {
    props: {
      depositers,
      selectedId,
      selectedData,
      message,
    },
  };
}
