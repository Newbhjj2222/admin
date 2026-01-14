// pages/index.js
import { useState, useEffect } from "react";
import { translateTexts } from "../utils/translate";

export default function AutoTranslateDemo() {
  const [textInput, setTextInput] = useState("");      // Text user yandika
  const [textsArray, setTextsArray] = useState([]);    // Lines zose ziri muri array
  const [translations, setTranslations] = useState([]); // results ziva kuri API
  const [loading, setLoading] = useState(false);

  // Buri kanda user akanda, split text muri lines
  const handleInputChange = (e) => {
    const value = e.target.value;
    setTextInput(value);

    const lines = value.split("\n").filter(line => line.trim() !== "");
    setTextsArray(lines);
  };

  // Auto-translate buri kanda user ahindura textsArray
  useEffect(() => {
    if (textsArray.length === 0) {
      setTranslations([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await translateTexts(textsArray, "en"); // English
        setTranslations(data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeout);
  }, [textsArray]);

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h1>Auto Translate Demo</h1>
      
      <textarea
        rows={6}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        placeholder="Andika amagambo hano..."
        value={textInput}
        onChange={handleInputChange}
      />

      <h2>Translations (English):</h2>
      {loading && <p>Translating...</p>}
      <ul>
        {translations.map((res, i) => (
          <li key={i}>
            <b>{res.original}</b> → {res.translated || res.error}
          </li>
        ))}
      </ul>
    </div>
  );
}
