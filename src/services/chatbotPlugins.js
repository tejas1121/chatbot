import { Chatbot } from "supersimpledev";

/* ---------- HELPERS ---------- */

const match = (message, keywords) =>
  keywords.some(k =>
    message.toLowerCase().includes(k)
  );

/* ---------- PLUGINS ---------- */
function extractCity(message) {
  const match = message.toLowerCase().match(/weather(?: in)? ([a-zA-Z\s]+)/);
  return match ? match[1].trim() : null;
}

export const plugins = [

  // 👋 Greeting
  {
    check: msg => match(msg, ["hi", "hello", "hey"]),
    handler: async () => {
      const greetings = [
        "Hello! 👋",
        "Hi there!",
        "Hey! How can I help?"
      ];
      return greetings[Math.floor(Math.random()*greetings.length)];
    }
  },

  // 📅 Date
  {
    check: msg => match(msg, ["date", "today"]),
    handler: async () => {
      return `Today is ${new Date().toDateString()}`;
    }
  },

  // 💡 Advice API
  {
    check: msg => match(msg, ["advice", "suggestion"]),
    handler: async () => {
      const res = await fetch("https://api.adviceslip.com/advice");
      const data = await res.json();
      return data.slip.advice;
    }
  },

  // 😂 Joke API
  {
    check: msg => match(msg, ["joke", "laugh"]),
    handler: async () => {
      const res = await fetch(
        "https://official-joke-api.appspot.com/random_joke"
      );
      const data = await res.json();
      return `${data.setup} 😂 ${data.punchline}`;
    }
  },

  // 🧠 Quote API
 {
  check: msg => match(msg, ["quote", "motivate", "inspire"]),
  handler: async () => {
    const res = await fetch("/api/quotes/api/random");
    const data = await res.json();

    return `"${data[0].q}" — ${data[0].a}`;
  }
},
{
  check: msg => match(msg, ["fact", "random fact", "trivia"]),
  handler: async () => {
    const res = await fetch("http://numbersapi.com/random/trivia?json");
    const data = await res.json();
    return `🧠 Did you know? ${data.text}`;
  }
},
{
  check: msg => match(msg, ["cat", "cat fact"]),
  handler: async () => {
    const res = await fetch("https://catfact.ninja/fact");
    const data = await res.json();
    return `🐱 Cat Fact: ${data.fact}`;
  }
},
{
  check: msg => msg.toLowerCase().includes("india"),
  handler: async () => {
    const res = await fetch(
      "https://restcountries.com/v3.1/name/india"
    );
    const data = await res.json();

    const country = data[0];

    return `🌍 ${country.name.common}
Capital: ${country.capital[0]}
Population: ${country.population.toLocaleString()}
Region: ${country.region}`;
  }
},
{
  check: msg => msg.toLowerCase().includes("weather"),

  handler: async (msg) => {
    try {
      const city = extractCity(msg);

      if (!city) {
        return "🌤 Please tell a city. Example: weather in Pune";
      }

      // 1️⃣ Get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );

      const geoData = await geoRes.json();

      if (!geoData.results) {
        return `❌ Couldn't find city "${city}".`;
      }

      const { latitude, longitude, name, country } =
        geoData.results[0];

      // 2️⃣ Get weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      const weatherData = await weatherRes.json();

      const weather = weatherData.current_weather;

      return `🌤 Weather in ${name}, ${country}
Temperature: ${weather.temperature}°C
Wind Speed: ${weather.windspeed} km/h`;

    } catch {
      return "⚠️ Unable to fetch weather right now.";
    }
  }
}
];



/* ---------- ENGINE ---------- */

export async function getBotResponse(message) {

  for (const plugin of plugins) {
    if (plugin.check(message)) {
      return await plugin.handler(message);
    }
  }

  // fallback → supersimpledev
  return Chatbot.getResponse(message);
}