// utils/translate.js
export async function translateTexts(texts, lang = "en") {
  const url = "http://127.0.0.1:5000/translate"; // cyangwa public URL niba deployed
  const apiKey = "nettal001s"; // shyira muri .env.local ku project nyakuri

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey
    },
    body: JSON.stringify({ texts, lang })
  });

  if (!response.ok) throw new Error("Failed to translate");

  return response.json(); // izasubiza JSON: {results: [...]}
}
