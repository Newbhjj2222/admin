import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Net from "@/components/Net"; // import Net component

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Net />  {/* Iyi izajya ihora hejuru */}
      <Component {...pageProps} /> {/* content z’izi pages zizaza munsi ya Net */}
      <ThemeSwitcher />
    </ThemeProvider>
  );
}
