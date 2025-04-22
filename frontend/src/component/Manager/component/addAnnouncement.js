import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddAnnouncement() {
  // Already fixed in your code
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // This should work now with proper component naming
    setDate(new Date().toISOString());
    const userId = getCurrentUserId();
    setSender(userId);
  }, []);

  function getCurrentUserId() {
    // Replace this with your actual method to get the user ID
    return "605c72ef2f799e2a4c8b4567"; // Example user ID
  }

  function sendAnnData(e) {
    e.preventDefault();

    const newAnnouncement = {
      title,
      message,
      sender,
      date,
    };

    axios
      .post(
        "http://localhost:8070/api/announcement/addAnnouncement",
        newAnnouncement
      )
      .then(() => {
        alert("Announcement Added Successfully! ✅");
        setTitle("");
        setMessage("");
        setSender("");
        setDate("");
        navigate("/fetchAnnouncement");
      })
      .catch((err) => {
        alert("Error adding Announcement: " + err.message);
      });

    console.log(newAnnouncement);
  }

  return (
    <form className="container mt-4" onSubmit={sendAnnData}>
      <div className="form-group">
        <label htmlFor="titleInput">Title</label>
        <input
          type="text"
          className="form-control"
          id="titleInput"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="messageInput">Announcement</label>
        <textarea // Changed to textarea for better message input
          className="form-control"
          id="messageInput"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <small id="messageHelp" className="form-text text-muted">
          Enter your announcement details here.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="senderInput">Sender</label>
        <input
          type="text"
          className="form-control"
          id="senderInput"
          placeholder="Enter Sender"
          value={sender}
          readOnly // Added readOnly since sender is set automatically
        />
      </div>

      <input
        type="hidden"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}
