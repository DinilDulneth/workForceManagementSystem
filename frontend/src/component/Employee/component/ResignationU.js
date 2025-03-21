import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateResignation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resignation, setResignation] = useState({
    empId: "",
    Reason: "",
    endDate: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8070/resignation/getempResByID/${id}`)
      .then((res) => {
        setResignation(res.data);
      })
      .catch((err) => {
        alert("Error fetching resignation: " + err.message);
      });
  }, [id]);

  function updateResignationData(e) {
    e.preventDefault();

    const updatedResignation = {
      empId: resignation.empId,
      Reason: resignation.Reason,
      endDate: resignation.endDate,
    };

    axios
      .put(
        `http://localhost:8070/resignation/updateempRes/${id}`,
        updatedResignation
      )
      .then(() => {
        alert("Resignation Updated Successfully! ✅");
        navigate("/allResignations");
      })
      .catch((err) => {
        alert("Error updating resignation: " + err.message);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setResignation({
      ...resignation,
      [name]: value,
    });
  }

  return (
    <div className="container mt-4">
      <h2>Update Resignation</h2>
      <form onSubmit={updateResignationData}>
        <div className="form-group">
          <label>Employee ID</label>
          <input
            type="text"
            className="form-control"
            name="empId"
            value={resignation.empId}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Reason for Resignation</label>
          <textarea
            className="form-control"
            name="Reason"
            value={resignation.Reason}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            name="endDate"
            value={resignation.endDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Update
        </button>
      </form>
    </div>
  );
}