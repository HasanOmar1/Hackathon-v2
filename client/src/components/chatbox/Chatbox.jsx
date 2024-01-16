import React, { useState, useEffect } from "react";
import { TextField, IconButton, Container, Paper, Grid } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

import "./chatbox.css";

export default function Chatbox() {
  const [userInput, setUserInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleDescriptionInput = (event) => {
    setDescriptionInput(event.target.value);
  };

  const handleDateInput = (event) => {
    setDateInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (
      userInput.trim() === "" ||
      descriptionInput.trim() === "" ||
      dateInput.trim() === ""
    )
      return;

    // Set loading to true to indicate that AI is typing
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/chat", {
        message: userInput,
        language: "english",
        description: descriptionInput,
        date: dateInput,
      });

      // Update chat history with user input and AI response
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: userInput },
        { role: "assistant", content: response.data },
      ]);

      // Clear user input and set loading to false
      setUserInput("");
      setDescriptionInput("");
      setDateInput("");
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatContainer}>
        <h1 style={styles.title}>OpenAI Chat</h1>
        <div id="chat-history" style={styles.chatHistory}>
          {chatHistory.map((message, index) => (
            <div key={index} style={styles.message}>
              <span
                style={{
                  ...styles.messageRole,
                  color: message.role === "user" ? "#007bff" : "#333",
                }}
              >
                {message.role === "user" ? "User:" : "Assistant:"}
              </span>
              {message.content}
            </div>
          ))}
          {/* Show loading indicator if AI is typing */}
          {isLoading && (
            <div style={styles.loadingIndicator}>Assistant is typing...</div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            style={styles.userInput}
            placeholder="Enter your message"
          />
          <input
            type="text"
            value={descriptionInput}
            onChange={handleDescriptionInput}
            style={styles.userInput}
            placeholder="Enter description"
          />
          <input
            type="text"
            value={dateInput}
            onChange={handleDateInput}
            style={styles.userInput}
            placeholder="Enter date"
          />
          <button onClick={handleSubmit} style={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#242628",
  },
  chatContainer: {
    width: "1000px",
    padding: "50px",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    background: "#343839",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#70f6a1",
    fontWeight: "bold",
    paddingTop: "30px",
  },
  chatHistory: {
    height: "500px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px",
    background: "#F3F3F3",
    borderRadius: "5px",
    color: "#333",
  },
  message: {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    letterSpacing: "1.5px",
    padding: "5px",
    lineHeight: "1.5",
  },
  messageRole: {
    fontWeight: "bold",
    marginRight: "5px",
    fontSize: "14px",
  },
  userInput: {
    flex: "1",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  sendButton: {
    padding: "8px",
    cursor: "pointer",
    background: "#70f6a1",
    color: "black",
    fontWeight: "bold",
    borderRadius: "5px",
    border: "none",
    fontSize: "14px",
  },
  loadingIndicator: {
    textAlign: "right",
    color: "#aaa",
    fontStyle: "italic",
  },
};
