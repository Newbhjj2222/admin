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

  async function analyzeStory() {
    if (!selected) return alert("Hitamo inkuru ubanze");

    const snap = await getDoc(doc(db, "stories", selected));
    if (!snap.exists()) return alert("Inkuru ntibonetse");

    const data = snap.data();

    let totalWords = 0;
    let inappropriate = 0;
    let insults = 0;
    let explicit = 0;

    const inappropriateWords = ["gaswere","nyoko","igicucu","gapfe nabi"];
    const insultWords = ["wa mugaye","gucumita","gaswere"];
    const explicitWords = [
      "guswera","igituba","imboro","kunyaza",
      "gusohora","vagina","dick"
    ];

    data.episodes?.forEach(ep => {
      const text = JSON.stringify(ep).toLowerCase();
      const words = text.split(/\s+/);

      totalWords += words.length;

      inappropriateWords.forEach(w => text.includes(w) && inappropriate++);
      insultWords.forEach(w => text.includes(w) && insults++);
      explicitWords.forEach(w => text.includes(w) && explicit++);
    });

    const episodes = data.episodes?.length || 1;
    const avgWords = Math.round(totalWords / episodes);

    const pricePerWord = 3.4;
    const pricePerEpisode = avgWords * pricePerWord;
    const totalPrice = pricePerEpisode * episodes;

    setResult({
      storyName: data.storyName,
      author: data.authorName,
      episodes,
      totalWords,
      avgWords,
      pricePerEpisode,
      totalPrice,
      inappropriate,
      insults,
      explicit,
    });
  }

  const chartData = result && {
    labels: ["Amagambo mabi", "Ibitutsi", "Ubusambanyi"],
    datasets: [{
      label: "Umubare",
      data: [
        result.inappropriate,
        result.insults,
        result.explicit,
      ],
      backgroundColor: theme === "dark"
        ? ["#ef4444","#f59e0b","#a855f7"]
        : ["#dc2626","#d97706","#7c3aed"],
    }],
  };

  return (
    <div className="page">
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
          <h2>{result.storyName}</h2>

          <div className="grid">
            <p><strong>Umwanditsi:</strong> {result.author}</p>
            <p><strong>Episodes:</strong> {result.episodes}</p>
            <p><strong>Amazina yose:</strong> {result.totalWords}</p>
            <p><strong>Average / Episode:</strong> {result.avgWords}</p>
            <p><strong>Igiciro / Episode:</strong> {result.pricePerEpisode.toFixed(2)} RWF</p>
            <p className="price">
              <strong>Igiciro cy'Inkuru Yose:</strong> {result.totalPrice.toFixed(2)} RWF
            </p>
          </div>

          <div className="chart">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      )}

      <style jsx>{`
        .page {
          margin-top: 50px;
          padding: 16px;
          background: var(--background);
          min-height: 100vh;
        }

        .analysis {
          background: var(--bg-card);
          padding: 16px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 420px;
          margin: auto;
        }

        select, button {
          padding: 8px;
          border-radius: 6px;
          font-size: var(--text-base);
        }

        button {
          background: var(--primary);
          color: white;
          border: none;
        }

        .result {
          margin-top: 20px;
          background: var(--bg-card);
          padding: 16px;
          border-radius: 12px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px,1fr));
          gap: 10px;
        }

        .price {
          color: #16a34a;
          font-size: 18px;
        }

        .chart {
          margin-top: 20px;
          width: 100%;
          height: 260px;
        }

        @media (max-width: 600px) {
          h1, h2 {
            font-size: 18px;
          }
          .chart {
            height: 220px;
          }
        }
      `}</style>
    </div>
  );
}

/* ================= SSR ================= */
export async function getServerSideProps() {
  const snap = await getDocs(collection(db, "stories"));
  const stories = snap.docs.map(d => ({
    id: d.id,
    storyName: d.data().storyName || null,
  }));
  return { props: { stories } };
}
