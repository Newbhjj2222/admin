'use client';

import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "@/components/theme";
import Net from "@/components/Net";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Analyser({ stories }) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState(null);

  const analyzeStory = async () => {
    if (!selected) return alert("Hitamo inkuru ubanze");

    const ref = doc(db, "stories", selected);
    const snap = await getDoc(ref);

    if (!snap.exists()) return alert("Inkuru ntibonetse");

    const data = snap.data();

    let totalWords = 0;
    let inappropriate = 0;
    let insults = 0;
    let explicit = 0;

    const inappropriateWords = [
      "gaswere","nyoko","igicucu","gapfe nabi","kicwe n'imiruho"
    ];
    const insultWords = [
      "wa mugaye","gucumita","gaswere"
    ];
    const explicitWords = [
      "guswera","igituba","imboro","kunyaza","kunnyaza",
      "gusohora","gushyukwa","vagina","dick"
    ];

    data.episodes?.forEach(ep => {
      const text = JSON.stringify(ep).toLowerCase();
      const words = text.split(/\s+/);
      totalWords += words.length;

      inappropriateWords.forEach(w => text.includes(w) && inappropriate++);
      insultWords.forEach(w => text.includes(w) && insults++);
      explicitWords.forEach(w => text.includes(w) && explicit++);
    });

    const avg = data.episodes?.length
      ? Math.round(totalWords / data.episodes.length)
      : 0;

    setResult({
      totalWords,
      avg,
      inappropriate,
      insults,
      explicit,
      episodes: data.episodes?.length || 0,
      author: data.authorName,
      storyName: data.storyName,
    });
  };

  const chartData = result && {
    labels: ["Amagambo mabi", "Ibitutsi", "Ubusambanyi"],
    datasets: [
      {
        label: "Umubare wagaragaye",
        data: [
          result.inappropriate,
          result.insults,
          result.explicit,
        ],
        backgroundColor: theme === "dark"
          ? ["#ef4444","#f59e0b","#a855f7"]
          : ["#dc2626","#d97706","#7c3aed"],
      },
    ],
  };

  return (
    <div className="container">
      <Net />

      <div className="analysis">
        <h1>Isuzuma ry'Inkuru</h1>

        <select value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">-- Hitamo Inkuru --</option>
          {stories.map(s => (
            <option key={s.id} value={s.id}>
              {s.storyName || s.id}
            </option>
          ))}
        </select>

        <button onClick={analyzeStory}>Analysis</button>
      </div>

      {result && (
        <div className="result">
          <h3>{result.storyName}</h3>

          <p><strong>Umwanditsi:</strong> {result.author}</p>
          <p><strong>Episodes:</strong> {result.episodes}</p>
          <p><strong>Amazina yose:</strong> {result.totalWords}</p>
          <p><strong>Average / Episode:</strong> {result.avg}</p>

          <div className="chart">
            <Bar data={chartData} />
          </div>

          <div className="badWords">
            <p><strong>Amagambo mabi:</strong> {result.inappropriate}</p>
            <p><strong>Ibitutsi:</strong> {result.insults}</p>
            <p><strong>Ubusambanyi:</strong> {result.explicit}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 20px;
          background: var(--background);
          color: var(--foreground);
          min-height: 100vh;
        }
        .analysis {
          background: var(--bg-card);
          padding: 16px;
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        select, button {
          padding: 6px 10px;
          border-radius: 6px;
          font-size: var(--text-base);
        }
        button {
          background: var(--primary);
          color: white;
          border: none;
          cursor: pointer;
        }
        .result {
          margin-top: 20px;
          background: var(--bg-card);
          padding: 16px;
          border-radius: 12px;
        }
        .chart {
          max-width: 600px;
          margin: auto;
        }
        .badWords {
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px,1fr));
          gap: 10px;
        }
      `}</style>
    </div>
  );
}

/* ===================== SSR ===================== */
export async function getServerSideProps() {
  const snapshot = await getDocs(collection(db, "stories"));
  const stories = snapshot.docs.map(d => ({
    id: d.id,
    storyName: d.data().storyName || null
  }));

  return { props: { stories } };
}
