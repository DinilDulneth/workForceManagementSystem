import React, { useState } from "react";
import chatbotMessages from "../chatbot/messages.js";
import anjuImage from "../assets/images/assistant.png";
import chatIcon from "../assets/images/assistant.png";

const Chatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const getResponse = (userInput) => {
    const normalizedInput = userInput.trim().toLowerCase();
    return chatbotMessages[normalizedInput] || chatbotMessages["default"];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, fromUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    setTimeout(() => {
      const botResponse = { text: getResponse(input), fromUser: false };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const styles = {
    chatbotButton: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      cursor: 'pointer',
      zIndex: 1000
    },
    chatIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.1)'
      }
    },
    chatWindow: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '320px',
      height: '450px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
      transform: isChatbotOpen ? 'translateX(0)' : 'translateX(calc(100% + 20px))',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 999,
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: '#7C3AED',
      color: 'white'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    botAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: '2px solid white'
    },
    botTitle: {
      margin: 0,
      fontSize: '16px',
      fontWeight: 600
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }
    },
    messageContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      backgroundColor: '#f8fafc'
    },
    botMessage: {
      backgroundColor: '#f1f5f9',
      color: '#1e293b',
      padding: '12px 16px',
      borderRadius: '12px',
      maxWidth: '80%',
      alignSelf: 'flex-start',
      fontSize: '14px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    userMessage: {
      backgroundColor: '#7C3AED',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '12px',
      maxWidth: '80%',
      alignSelf: 'flex-end',
      fontSize: '14px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    inputContainer: {
      padding: '16px',
      borderTop: '1px solid #e2e8f0',
      backgroundColor: 'white'
    },
    inputWrapper: {
      display: 'flex',
      gap: '8px'
    },
    input: {
      flex: 1,
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      '&:focus': {
        borderColor: '#7C3AED'
      }
    },
    sendButton: {
      backgroundColor: '#7C3AED',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0 16px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: '#6D28D9'
      }
    }
  };

  return (
    <>
      {!isChatbotOpen && (
        <div style={styles.chatbotButton} onClick={() => setIsChatbotOpen(true)}>
          <img src={chatIcon} alt="Chat" style={styles.chatIcon} />
        </div>
      )}

      <div style={styles.chatWindow}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <img src={anjuImage} alt="Bot Avatar" style={styles.botAvatar} />
            <h3 style={styles.botTitle}>Wonderchat AI</h3>
          </div>
          <button 
            onClick={() => setIsChatbotOpen(false)}
            style={styles.closeButton}
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        <div style={styles.messageContainer}>
          <div style={styles.botMessage}>
            Hi! I'm your virtual assistant, always ready to support you. What can I help you with today?
          </div>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={msg.fromUser ? styles.userMessage : styles.botMessage}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div style={styles.inputContainer}>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.input}
            />
            <button 
              onClick={handleSend}
              style={styles.sendButton}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;