import { useState } from "react";
import { translateTexts } from "@/utils/translate";

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [textsArray, setTextsArray] = useState([]);
  const [translations, setTranslations] = useState([]);

  const handleAddText = () => {
    if (textInput.trim() !== "") {
      setTextsArray([...textsArray, textInput]);
      setTextInput("");
    }
  };

  const handleTranslate = async () => {
    if (textsArray.length === 0) return;
    try {
      const data = await translateTexts(textsArray, "en");
      setTranslations(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Translate Demo</h1>
      
      <div>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Andika amagambo hano"
        />
        <button onClick={handleAddText}>Add</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleTranslate}>Translate All</button>
      </div>

      <h2>Texts to Translate:</h2>
      <ul>
        {textsArray.map((t, i) => <li key={i}>{t}</li>)}
      </ul>

      <h2>Translations:</h2>
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
