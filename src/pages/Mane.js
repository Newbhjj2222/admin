import { collection, getDocs } from "firebase/firestore";
import { db } from "@/components/firebase";
import dynamic from "next/dynamic";
import styles from "@/styles/manager.module.css";

// 📊 Chart (client-side only)
const ViewsChart = dynamic(() => import("@/components/ViewsChart"), {
  ssr: false,
});

// =======================================
// 🧼 CLEAN & NORMALIZE STORY TITLE
// =======================================
export function cleanStoryHead(head = "") {
  if (!head || typeof head !== "string") return "";

  return head
    // remove episode info
    .replace(/\bEP(ISODE)?\s*\d+\b/gi, "")
    // remove season words
    .replace(/\b(SEASON|SERIES)\s*\d+\b/gi, "")
    // remove S01, S2, S12
    .replace(/\bS\d+\b/gi, "")
    // remove PART 1, PART 2
    .replace(/\bPART\s*\d+\b/gi, "")
    // remove FINAL, NEW SEASON
    .replace(/\b(FINAL|NEW\s*SEASON)\b/gi, "")
    // remove separators
    .replace(/[-–—|:]/g, " ")
    // normalize spaces
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

// =======================================
// 🎬 EXTRACT SEASON NUMBER FROM HEAD
// =======================================
export function extractSeason(head = "") {
  if (!head || typeof head !== "string") return 1;

  // Season 2 / Series 3
  const seasonWord = head.match(/\b(SEASON|SERIES)\s*(\d+)\b/i);
  if (seasonWord) return Number(seasonWord[2]);

  // S01 / S2 / S12
  const seasonShort = head.match(/\bS(\d+)\b/i);
  if (seasonShort) return Number(seasonShort[1]);

  // default → Season 1
  return 1;
}

export async function getServerSideProps() {
  const snap = await getDocs(collection(db, "posts"));
  const posts = [];

  snap.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() });
  });

  // =======================================
  // 🧠 MAPS
  // =======================================
  const storiesMap = {};
  const authorMap = {};

  posts.forEach((p) => {
    const storyKey = cleanStoryHead(p.head);
    const season = extractSeason(p.head);
    const views = Number(p.views) || 0;

    // ===== STORIES =====
    if (!storiesMap[storyKey]) {
      storiesMap[storyKey] = {
        title: storyKey,
        totalViews: 0,
        episodes: 0,
        seasons: new Set(), // 🔥 seasons storage
        imageUrl: p.imageUrl || "",
      };
    }

    storiesMap[storyKey].totalViews += views;
    storiesMap[storyKey].episodes += 1;
    storiesMap[storyKey].seasons.add(season);

    // ===== AUTHORS =====
    if (p.author) {
      if (!authorMap[p.author]) {
        authorMap[p.author] = {
          author: p.author,
          totalViews: 0,
          stories: new Set(),
        };
      }

      authorMap[p.author].totalViews += views;
      authorMap[p.author].stories.add(storyKey);
    }
  });

  // =======================================
  // 🔥 TOP STORIES
  // =======================================
  const stories = Object.values(storiesMap).map((s) => {
    const avg = s.episodes ? s.totalViews / s.episodes : 0;

    return {
      title: s.title,
      totalViews: s.totalViews,
      episodes: s.episodes,
      seasonsCount: s.seasons.size, // ✅ number of seasons
      avgViews: Math.round(avg),
      trending: avg >= 500,
      imageUrl: s.imageUrl,
    };
  });

  const topStories = [...stories]
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 10);

  // =======================================
  // ⭐ POPULAR AUTHORS
  // =======================================
  const popularAuthors = Object.values(authorMap)
    .map((a) => ({
      author: a.author,
      totalViews: a.totalViews,
      storiesCount: a.stories.size,
      avgPerStory: Math.round(a.totalViews / a.stories.size),
    }))
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 10);

  // =======================================
  // 📢 SHARE SUGGESTIONS (EPISODES)
  // =======================================
  const shareBoost = [...posts]
    .filter((p) => p.views)
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
        <h2 className={styles.sectionTitle}>📈 Inkuru zikunzwe (Views)</h2>
        <ViewsChart data={topStories} />
      </section>

      {/* TOP STORIES */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🔥 Inkuru 10 zasomwe cyane</h2>
        <div className={styles.list}>
          {topStories.map((s, i) => (
            <div key={s.title} className={styles.listItem}>
              <strong>
                {i + 1}. {s.title}
                {s.trending && (
                  <span className={styles.badge}>🔥 Trending</span>
                )}
              </strong>
              <span className={styles.itemMeta}>
                {s.totalViews} views · {s.episodes} eps ·{" "}
                {s.seasonsCount} seasons · avg {s.avgViews}/ep
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
              <strong>
                {i + 1}. {a.author}
              </strong>
              <span className={styles.itemMeta}>
                {a.totalViews} views · {a.storiesCount} inkuru · avg{" "}
                {a.avgPerStory}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SHARE BOOST */}
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
