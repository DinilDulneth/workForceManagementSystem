import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FetchAnnouncement() {
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState([]);

  useEffect(() => {
    getAnnouncement(); // ✅ Call the function inside useEffect
  }, []); // ✅ Empty dependency array ensures useEffect runs only once on component mount

  function getAnnouncement() {
    axios
      .get("http://localhost:8070/api/announcement/getAnnouncement")
      .then((res) => {
        console.log(res.data);
        setAnnouncement(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  // Delete Student by ID
  function deleteAnnouncement(id) {
    axios
      .delete(`http://localhost:8070/api/announcement/deleteAnnouncement/${id}`)
      .then(() => {
        alert("Announcement deleted successfully");
        setAnnouncement(
          announcement.filter((announcement) => announcement._id !== id)
        ); // Update UI
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Announcements</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <ul className="list-group">
            {announcement.map((announcement) => (
              <li
                key={announcement._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>{announcement.Title}</strong> -{announcement.message}
                  <br />
                  <small>
                    Sender: {announcement.sender} -{" "}
                    {new Date(announcement.date).toLocaleDateString()}
                  </small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
