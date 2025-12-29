import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
      <ThemeSwitcher />
    </ThemeProvider>
  );
}
