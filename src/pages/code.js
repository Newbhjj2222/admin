'use client';

import { useState } from "react";
import { FiCopy } from "react-icons/fi"; // React Icons copy icon
import styles from "@/styles/code.module.css";

const codeSnippets = [
  {
    id: 1,
    title: "Gusiba umushinga muri Termux",
    code: `rm -rf name`,
    description:
      "Iyi command isiba umushinga wose cyangwa folder muri Termux. 'name' ni izina ry'umushinga ushaka gusiba.",
  },
  {
    id: 2,
    title: "Gutangira umushinga wa Next.js",
    code: `npx create-next-app@latest name`,
    description:
      "Iyi command itangiza umushinga mushya wa Next.js. 'name' ni izina ry'umushinga wawe.",
  },
  {
    id: 3,
    title: "Gushyira mo Firebase na React Icons",
    code: `npm install firebase react-icons`,
    description:
      "Iyi command ishyiramo packages za Firebase na React Icons mu mushinga wawe.",
  },
  {
    id: 4,
    title: "Gushyira mo Hook",
    code: `npm install react-hook-form`,
    description:
      "Iyi package ikoreshwa mu gukora forms muri React neza kandi mu buryo bwihuse.",
  },
  {
    id: 5,
    title: "Gushyira mo Chart",
    code: `npm install chart.js react-chartjs-2`,
    description:
      "Iyi command ishyiramo Chart.js na React wrapper yayo, bigufasha gukora charts muri React.",
  },
  {
    id: 6,
    title: "Shyiramo JS Cookies",
    code: `npm install js-cookie cookie`,
    description:
      "Iyi package ikoreshwa mu kubika no gucunga cookies muri React cyangwa JavaScript.",
  },
  {
    id: 7,
    title: "Gushyira mo Firebase Admin SDK igihe ari ngombwa",
    code: `npm install firebase-admin`,
    description:
      "Firebase Admin SDK ikoreshwa ku server side mu kubika no gucunga database, authentication n'ibindi.",
  },
  {
    id: 8,
    title: "Gukora Push",
    code: `git remote add origin https://github.com/Newbhjj2222/nameofrepo.git`,
    description: "Shyiraho repository yawe ya GitHub nk'origin.",
  },
  {
    id: 9,
    title: "Gukora Pull Rebase",
    code: `git pull origin main --rebase`,
    description:
      "Iyi command ikurura updates za remote repository ikazihuza na local branch yawe.",
  },
  {
    id: 10,
    title: "GitHub Username & Token",
    code: `Username: Newbhjj2222
Token: ghp_QEiYTUNVGJSmkHymlvqBt43BG2arK80VHKh`,
    description:
      "Ibi ni credentials bya GitHub byo gukora authentication mu gihe ukoresha command line.",
  },
  // Commands nshya zigenzi
  {
    id: 11,
    title: "Kugenzura version ya Node.js",
    code: `node -v`,
    description: "Iyi command igaragaza version ya Node.js iriho muri system yawe.",
  },
  {
    id: 12,
    title: "Gushyira mo ESLint na Prettier",
    code: `npm install eslint prettier eslint-config-prettier eslint-plugin-react --save-dev`,
    description:
      "Ibi bituma umushinga wawe uba clean kandi code igahora ihuye n'amabwiriza y'uburyo bwiza bwo kwandika code.",
  },
  {
    id: 13,
    title: "Kugenzura status ya git",
    code: `git status`,
    description: "Iyi command igaragaza uko repository yawe ihagaze ubu, harimo changes zitarashyirwa commit.",
  },
  {
    id: 14,
    title: "Gushyira mo TailwindCSS",
    code: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`,
    description:
      "Iyi command itangiza TailwindCSS mu mushinga wawe wa Next.js.",
  },
];

export default function CodePage() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Next.js Code Snippets</h1>
      {codeSnippets.map((snippet) => (
        <div key={snippet.id} className={styles.snippet}>
          <div className={styles.header}>
            <h2>{snippet.title}</h2>
            <FiCopy
              className={styles.copyIcon}
              onClick={() => handleCopy(snippet.code, snippet.id)}
            />
          </div>
          <pre className={styles.codeBlock}>
            <code>{snippet.code}</code>
          </pre>
          <p className={styles.description}>{snippet.description}</p>
          {copiedId === snippet.id && (
            <span className={styles.copiedMsg}>Copied!</span>
          )}
        </div>
      ))}
    </div>
  );
}
