import { useState } from 'react';
import './ChatInput.css';
import { getBotResponse } from "../services/chatbotPlugins";

/* ---------- TIME HELPER ---------- */

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
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

  /* ---------- SEND MESSAGE ---------- */

  async function sendMessage() {
    if (!inputText.trim()) return;

    // USER MESSAGE
    const userMessage = {
      message: inputText,
      sender: "user",
      id: crypto.randomUUID(),
      time: getCurrentTime()
    };

    setChatMessages(prev => [...prev, userMessage]);

    const userText = inputText;
    setInputText("");

    // BOT RESPONSE
    const response = await getBotResponse(userText);

    const robotMessage = {
      message: response,
      sender: "robot",
      id: crypto.randomUUID(),
      time: getCurrentTime()
    };

    setChatMessages(prev => [...prev, robotMessage]);
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