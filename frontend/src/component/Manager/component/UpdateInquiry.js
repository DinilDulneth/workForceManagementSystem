import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateInquiry() {
  const { id } = useParams(); // Get inquiry ID from URL params
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState({
    employeeId: "",
    inquiry: "",
    sender: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8070/api/inquiry/getInquiry`) // Note: This should ideally be a single inquiry endpoint
      .then((res) => {
        const inquiryData = res.data.find((item) => item._id === id);
        if (inquiryData) {
          setInquiry({
            employeeId: inquiryData.employeeId,
            inquiry: inquiryData.inquiry,
            sender: inquiryData.sender,
          });
        }
      })
      .catch((err) => {
        alert("Error fetching inquiry: " + err.message);
      });
  }, [id]);

  function updateInquiryData(e) {
    e.preventDefault();

    const updatedInquiry = {
      employeeId: inquiry.employeeId,
      inquiry: inquiry.inquiry,
      sender: inquiry.sender,
    };

    axios
      .put(
        `http://localhost:8070/api/inquiry/updateInquiry/${id}`,
        updatedInquiry
      )
      .then(() => {
        alert("Inquiry Updated Successfully! ✅");
        navigate(`/employee-inquiry/${inquiry.employeeId}`); // Redirect back to employee's inquiry list
      })
      .catch((err) => {
        alert("Error updating inquiry: " + err.message);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setInquiry({
      ...inquiry,
      [name]: value,
    });
  }

  return (
    <div className="container mt-4">
      <h2>Update Inquiry</h2>
      <form onSubmit={updateInquiryData}>
        <div className="form-group">
          <label>Employee ID</label>
          <input
            type="text"
            className="form-control"
            name="employeeId"
            value={inquiry.employeeId}
            onChange={handleChange}
            disabled // Making it read-only as it shouldn't change
          />
        </div>

        <div className="form-group">
          <label>Inquiry</label>
          <textarea
            className="form-control"
            name="inquiry"
            value={inquiry.inquiry}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Sender ID</label>
          <input
            type="text"
            className="form-control"
            name="sender"
            value={inquiry.sender}
            onChange={handleChange}
            disabled // Making it read-only as it shouldn't change
          />
        </div>

        <button type="submit" className="btn btn-success">
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateInquiry;
