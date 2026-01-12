import { collection, getDocs } from "firebase/firestore";
import { db } from "@/components/firebase";
import dynamic from "next/dynamic";
import styles from "@/styles/manager.module.css";

// Chart (client-side only)
const ViewsChart = dynamic(() => import("@/components/ViewsChart"), {
  ssr: false,
});

function cleanHead(head = "") {
  return head
    .replace(/S\d+/gi, "")
    .replace(/EP\s*\d+/gi, "")
    .replace(/Season\s*\d+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getServerSideProps() {
  const snap = await getDocs(collection(db, "posts"));

  let posts = [];
  snap.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() });
  });

  // ===============================
  // 🧠 GROUP BY INKURU (not episode)
  // ===============================
  const storiesMap = {};
  const authorMap = {};

  posts.forEach((p) => {
    const title = cleanHead(p.head);
    const views = p.views || 0;

    // Inkuru
    if (!storiesMap[title]) {
      storiesMap[title] = {
        title,
        totalViews: 0,
        episodes: 0,
        imageUrl: p.imageUrl || "",
      };
    }
    storiesMap[title].totalViews += views;
    storiesMap[title].episodes += 1;

    // Abanditsi
    if (!authorMap[p.author]) {
      authorMap[p.author] = {
        author: p.author,
        totalViews: 0,
        stories: new Set(),
      };
    }
    authorMap[p.author].totalViews += views;
    authorMap[p.author].stories.add(title);
  });

  const stories = Object.values(storiesMap);

  // 🔥 TOP 10 INKURU ZASOMWE CYANE
  const topStories = [...stories]
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 10);

  // ⭐ POPULAR AUTHORS
  const popularAuthors = Object.values(authorMap)
    .map((a) => ({
      author: a.author,
      totalViews: a.totalViews,
      storiesCount: a.stories.size,
    }))
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 10);

  // 📢 SHARE SUGGESTIONS (EPISODES)
  const shareBoost = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);

  return {
    props: {
      stats: {
        totalStories: stories.length,
        totalEpisodes: posts.length,
      },
      topStories,
      popularAuthors,
      shareBoost,
    },
  };
}

export default function ManagerPage({
  stats,
  topStories,
  popularAuthors,
  shareBoost,
}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📊 Manager Dashboard</h1>

      {/* STATS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Inkuru zose</h3>
          <p>{stats.totalStories}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Episodes zose</h3>
          <p>{stats.totalEpisodes}</p>
        </div>
      </div>

      {/* CHART */}
      <section>
        <h2 className={styles.sectionTitle}>📈 Top Inkuru (Views)</h2>
        <ViewsChart data={topStories} />
      </section>

      {/* TOP STORIES */}
      <section>
        <h2 className={styles.sectionTitle}>🔥 Inkuru 10 zasomwe cyane</h2>
        <div className={styles.list}>
          {topStories.map((s, i) => (
            <div key={s.title} className={styles.listItem}>
              <strong>{i + 1}. {s.title}</strong>
              <span>{s.totalViews} views</span>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR AUTHORS */}
      <section>
        <h2 className={styles.sectionTitle}>⭐ Abanditsi bakunzwe cyane</h2>
        <div className={styles.list}>
          {popularAuthors.map((a, i) => (
            <div key={a.author} className={styles.listItem}>
              <strong>{i + 1}. {a.author}</strong>
              <span>
                {a.totalViews} views · {a.storiesCount} inkuru
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SHARE */}
      <section>
        <h2 className={styles.sectionTitle}>📢 Share suggestions (Episodes)</h2>
        <div className={styles.list}>
          {shareBoost.map((p) => (
            <div key={p.id} className={styles.listItem}>
              👉 {p.head} ({p.views || 0} views)
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
