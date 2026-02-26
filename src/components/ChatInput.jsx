import { useState } from 'react';
import './ChatInput.css';
import { getBotResponse } from "../services/chatbotPlugins";

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

    const userMessage = {
      message: inputText,
      sender: "user",
      id: crypto.randomUUID()
    };

    // show user message
    setChatMessages(prev => [...prev, userMessage]);

    const userText = inputText;
    setInputText("");

    // get response from plugin engine
    const response = await getBotResponse(userText);

    // show robot reply
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