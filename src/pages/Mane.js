import { collection, getDocs } from "firebase/firestore";
import { db } from "@/components/firebase";
import dynamic from "next/dynamic";
import styles from "@/styles/manager.module.css";

// 📊 Chart (client-side only)
const ViewsChart = dynamic(() => import("@/components/ViewsChart"), {
  ssr: false,
});

// 🧼 Sukura head → ifate INKURU gusa
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

  const posts = [];
  snap.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() });
  });

  // ===============================
  // 🧠 GROUP BY INKURU & AUTHOR
  // ===============================
  const storiesMap = {};
  const authorMap = {};

  posts.forEach((p) => {
    const title = cleanHead(p.head);
    const views = Number(p.views) || 0;

    // ===== INKURU =====
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

    // ===== AUTHOR =====
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

  // ===============================
  // 🔥 TOP STORIES (BY VIEWS)
  // ===============================
  const stories = Object.values(storiesMap).map((s) => ({
    ...s,
    avgViews: Math.round(s.totalViews / s.episodes),
    trending: s.totalViews / s.episodes > 500, // 🔥 rule
  }));

  const topStories = stories
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 10);

  // ===============================
  // ⭐ POPULAR AUTHORS
  // ===============================
  const popularAuthors = Object.values(authorMap)
    .map((a) => ({
      author: a.author,
      totalViews: a.totalViews,
      storiesCount: a.stories.size,
      avgPerStory: Math.round(a.totalViews / a.stories.size),
    }))
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 10);

  // ===============================
  // 📢 SHARE SUGGESTIONS (EPISODES)
  // ===============================
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
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Inkuru zose</div>
          <div className={styles.cardValue}>{stats.totalStories}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Episodes zose</div>
          <div className={styles.cardValue}>{stats.totalEpisodes}</div>
        </div>
      </div>

      {/* CHART */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📈 Top Inkuru (Views)</h2>
        <ViewsChart data={topStories} />
      </section>

      {/* TOP STORIES */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🔥 Inkuru 10 zasomwe cyane</h2>
        <div className={styles.list}>
          {topStories.map((s, i) => (
            <div key={s.title} className={styles.listItem}>
              <strong>
                {i + 1}. {s.title}{" "}
                {s.trending && <span className={styles.badge}>🔥 Trending</span>}
              </strong>
              <span className={styles.itemMeta}>
                {s.totalViews} views · {s.episodes} eps · avg {s.avgViews}/ep
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR AUTHORS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>⭐ Abanditsi bakunzwe cyane</h2>
        <div className={styles.list}>
          {popularAuthors.map((a, i) => (
            <div key={a.author} className={styles.listItem}>
              <strong>{i + 1}. {a.author}</strong>
              <span className={styles.itemMeta}>
                {a.totalViews} views · {a.storiesCount} inkuru · avg {a.avgPerStory}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SHARE */}
      <section className={styles.section}>
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
