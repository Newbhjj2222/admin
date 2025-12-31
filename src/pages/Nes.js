// pages/nes.js
import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default function NESPage({
  depositers,
  selectedId,
  selectedData,
  message,
}) {
  return (
    <div className="container">
      <div className="giver">
        <h1>Management of NES</h1>

        {message && <p className="message">{message}</p>}

        {/* SEARCH + SELECT */}
        <form method="GET">
          <input
            type="text"
            name="search"
            placeholder="Shaka username..."
            className="searchInput"
          />

          <select name="user" className="documentSelect" defaultValue={selectedId || ""}>
            <option value="">Hitamo User</option>
            {depositers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id}
              </option>
            ))}
          </select>

          <button type="submit">Show</button>
        </form>
      </div>

      {/* TABLE */}
      {selectedData && (
        <div className="tableWrapper">
          <table className="nesTable">
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
                <td>
                  {selectedData.timestamp
                    ? selectedData.timestamp
                    : "N/A"}
                </td>
                <td>
                  <form method="POST">
                    <input type="hidden" name="user" value={selectedId} />
                    <input
                      type="text"
                      name="nes"
                      placeholder="New NES"
                      required
                    />
                    <button type="submit">Update</button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ===== CSS ===== */}
      <style jsx>{`
        .container {
          padding: 20px;
          margin-top: 70px;
          min-height: 100vh;
          background: var(--background);
          color: var(--foreground);
        }

        .giver {
          background: var(--bg-card);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        form {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }

        .searchInput,
        .documentSelect,
        input[type="text"] {
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid #334155;
          background: #020617;
          color: #e5e7eb;
        }

        button {
          padding: 8px 14px;
          border: none;
          border-radius: 6px;
          background: #2563eb;
          color: white;
          cursor: pointer;
        }

        button:hover {
          background: #1e40af;
        }

        .message {
          margin-bottom: 10px;
          color: #22c55e;
        }

        .tableWrapper {
          overflow-x: auto;
        }

        .nesTable {
          width: 100%;
          min-width: 700px;
          border-collapse: collapse;
        }

        .nesTable th,
        .nesTable td {
          border: 1px solid #334155;
          padding: 10px;
          white-space: nowrap;
        }

        .nesTable th {
          background: #2563eb;
          color: white;
        }

        .nesTable td {
          background: #020617;
        }

        @media (max-width: 768px) {
          .nesTable th,
          .nesTable td {
            font-size: 0.85rem;
          }
        }
      `}</style>
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
      await updateDoc(doc(db, "depositers", user), { nes });
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
