import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateAnnouncement() {
  const { id } = useParams(); // Get announcement ID from URL params
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toISOString());
    const userId = getCurrentUserId();
    setSender(userId);

    // Fetch the current announcement details using the ID from URL params
    axios
      .get(`http://localhost:8070/api/announcement/getAnnouncement/${id}`)
      .then((res) => {
        const announcement = res.data;
        setTitle(announcement.title);
        setMessage(announcement.message);
        setSender(announcement.sender);
        setDate(announcement.date);
      })
      .catch((err) => {
        alert("Error fetching announcement: " + err.message);
      });
  }, [id]);

  function getCurrentUserId() {
    // Replace this with your actual method to get the user ID
    // For example, you might get it from a token or a global state
    return "605c72ef2f799e2a4c8b4567"; // Example user ID
  }

  function updateAnnouncementData(e) {
    e.preventDefault(); // Prevents form from reloading

    const updatedAnnouncement = {
      title,
      message,
      sender,
      date,
    };

    // Send the updated announcement data to the server
    axios
      .put(
        `http://localhost:8070/api/announcement/updateAnnouncement/${id}`,
        updatedAnnouncement
      )
      .then(() => {
        alert("Announcement Updated Successfully! ✅");
        navigate(`/fetchAnnouncement/${id}`); // Redirect back to the announcement details or list page
      })
      .catch((err) => {
        alert("Error updating announcement: " + err.message);
      });

    console.log(updatedAnnouncement);
  }

  return (
    <form className="container mt-4" onSubmit={updateAnnouncementData}>
      <div className="form-group">
        <label htmlFor="exampleInputName">Title</label>
        <input
          type="text"
          className="form-control"
          id="exampleInputName"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="exampleInputEmail">Announcement</label>
        <input
          type="text"
          className="form-control"
          id="exampleInputText"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="exampleInputName">Sender</label>
        <input
          type="text"
          className="form-control"
          id="exampleInputName"
          placeholder="Enter Sender"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
        />
      </div>

      <input
        type="hidden"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button type="submit" className="btn btn-primary">
        Update Announcement
      </button>
    </form>
  );
}
