import { useState } from 'react';
import { Chatbot } from 'supersimpledev';
import './ChatInput.css';

/* ---------- KEYWORDS ---------- */

const greetingKeywords = ["hi", "hello", "hey", "greetings"];

const adviceKeywords = [
  "advice",
  "give advice",
  "need advice",
  "i want advice",
  "suggestion"
];

const dateKeywords = ["date", "today", "current date"];


/* ---------- INTENT CHECKERS ---------- */

function isGreeting(message) {
  const regex = new RegExp(`\\b(${greetingKeywords.join("|")})\\b`, "i");
  return regex.test(message);
}

function wantsAdvice(message) {
  const regex = new RegExp(`\\b(${adviceKeywords.join("|")})\\b`, "i");
  return regex.test(message);
}

function wantsDate(message) {
  const regex = new RegExp(`\\b(${dateKeywords.join("|")})\\b`, "i");
  return regex.test(message);
}


/* ---------- COMPONENT ---------- */

function ChatInput({ chatMessages, setChatMessages }) {

  const [inputText, setInputText] = useState('');

  function saveInputText(event) {
    setInputText(event.target.value);
  }

  function handleKeyClick(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  /* ---------- MAIN MESSAGE ROUTER ---------- */

  async function sendMessage() {
    if (!inputText.trim()) return;

    const userMessage = {
      message: inputText,
      sender: 'user',
      id: crypto.randomUUID()
    };

    // show user message immediately
    setChatMessages(prev => [...prev, userMessage]);
    setInputText('');

    /* ===== GREETING ===== */
    if (isGreeting(inputText)) {
      const greetings = [
        "Hello! 👋",
        "Hi there! How can I help?",
        "Hey! What do you need?"
      ];

      setChatMessages(prev => [
        ...prev,
        {
          message: greetings[Math.floor(Math.random() * greetings.length)],
          sender: "robot",
          id: crypto.randomUUID()
        }
      ]);
      return;
    }

    /* ===== DATE ===== */
    if (wantsDate(inputText)) {
      const today = new Date().toDateString();

      setChatMessages(prev => [
        ...prev,
        {
          message: `Today is ${today}`,
          sender: "robot",
          id: crypto.randomUUID()
        }
      ]);
      return;
    }

    /* ===== ADVICE API ===== */
    if (wantsAdvice(inputText)) {
      try {
        const res = await fetch("https://api.adviceslip.com/advice");
        const data = await res.json();

        setChatMessages(prev => [
          ...prev,
          {
            message: data.slip.advice,
            sender: "robot",
            id: crypto.randomUUID()
          }
        ]);

      } catch {
        setChatMessages(prev => [
          ...prev,
          {
            message: "Couldn't fetch advice right now.",
            sender: "robot",
            id: crypto.randomUUID()
          }
        ]);
      }

      return;
    }

    /* ===== FALLBACK → SUPERSIMPLEDEV ===== */
    const response = Chatbot.getResponse(inputText);

    setChatMessages(prev => [
      ...prev,
      {
        message: response,
        sender: "robot",
        id: crypto.randomUUID()
      }
    ]);
  }

  /* ---------- UI ---------- */

  return (
    <div className="chat-input-container">
      <textarea
        placeholder="Send a message to Chatbot"
        onChange={saveInputText}
        value={inputText}
        className="chat-input"
        onKeyDown={handleKeyClick}
      />

      <button onClick={sendMessage} className="send-button">
        Send
      </button>
    </div>
  );
}

export default ChatInput;