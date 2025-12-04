import React, { useState } from "react";
import "./chatbot.css";  // we will create this next

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! 💚 How can I help you with farming today? 😊" }
  ]);

async function sendMessage() {
  if (!input.trim()) return;

  // Add user message
  const userMsg = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMsg]);

// Send to Python backend
const res = await fetch("http://127.0.0.1:5000/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question: input }),   // <-- FIX
});

const data = await res.json();

// Add bot reply
const botMsg = { sender: "bot", text: data.text };
setMessages((prev) => [...prev, botMsg]);

setInput("");
}


  return (
    <div className="chat-container">
      <h2 className="chat-title">💬 FarmChainX Chatbot</h2>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={sendMessage}>Send ➤</button>
      </div>
    </div>
  );
}

export default Chatbot;
