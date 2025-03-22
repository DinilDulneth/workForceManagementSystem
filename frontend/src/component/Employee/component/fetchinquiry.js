import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FetchInquiry() {
  // Changed to named function with separate export
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState([]);

  useEffect(() => {
    getInquiry();
  }, []);

  function getInquiry() {
    axios
      .get("http://localhost:8070/api/inquiry/getInquiry") // Using your router's GET endpoint
      .then((res) => {
        console.log(res.data);
        setInquiry(res.data);
      })
      .catch((err) => {
        alert("Error fetching inquiry: " + err.message);
        console.error(err);
      });
  }

  // Delete inquiry by ID
  function deleteInquiry(id) {
    axios
      .delete(`http://localhost:8070/api/inquiry/deleteInquiry/${id}`) // Using your router's DELETE endpoint
      .then(() => {
        alert("inquiry deleted successfully");
        setInquiry(inquiry.filter((inquiry) => inquiry._id !== id));
      })
      .catch((err) => {
        alert("Error deleting inquiry: " + err.message);
        console.error(err);
      });
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Inquiry List</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <ul className="list-group">
            {inquiry.map((inquiry) => (
              <li
                key={inquiry._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>Employee ID: {inquiry.employeeId}</strong> -
                  {inquiry.inquiry}
                  <br />
                  <small>
                    Sender: {inquiry.sender} -{" "}
                    {new Date(inquiry.date).toLocaleDateString()}
                  </small>
                </span>
                <div>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => deleteInquiry(inquiry._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/updateInquiry/${inquiry._id}`)}
                  >
                    Update
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FetchInquiry;
