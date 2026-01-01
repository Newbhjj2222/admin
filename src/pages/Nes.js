
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
                <td>{selectedData.timestamp || "N/A"}</td>
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

//
// ================== SSR ==================
//
export async function getServerSideProps(context) {
  const { query, req } = context;
  const selectedId = query.user || null;
  const search = query.search || "";
  let message = null;

  // HANDLE UPDATE (POST)
  if (req.method === "POST") {
    let body = "";
    await new Promise((resolve) => {
      req.on("data", (chunk) => (body += chunk));
      req.on("end", resolve);
    });

    const params = new URLSearchParams(body);
    const user = params.get("user");
    const nes = params.get("nes");

    if (user && nes) {
      await updateDoc(doc(db, "depositers", user), {
        nes: Number(nes),
      });
      message = "NES yavuguruwe neza!";
    }
  }

  // FETCH ALL DEPOSITERS
  const snap = await getDocs(collection(db, "depositers"));
  let depositers = snap.docs.map((d) => ({ id: d.id }));

  if (search) {
    depositers = depositers.filter((d) =>
      d.id.toLowerCase().includes(search.toLowerCase())
    );
  }

  // FETCH SELECTED USER
  let selectedData = null;
  if (selectedId) {
    const d = await getDoc(doc(db, "depositers", selectedId));
    if (d.exists()) {
      const data = d.data();
      selectedData = {
        ...data,
        timestamp: data.timestamp
          ? data.timestamp.toDate().toLocaleDateString("en-GB")
          : null,
      };
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
