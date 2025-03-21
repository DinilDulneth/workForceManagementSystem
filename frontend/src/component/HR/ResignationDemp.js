import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FetchResignations() {
  const navigate = useNavigate();
  const [resignations, setResignations] = useState([]);

  useEffect(() => {
    getResignations(); // ✅ Call the function inside useEffect
  }, []); // ✅ Empty dependency array ensures useEffect runs only once on component mount

  function getResignations() {
    axios
      .get(`http://localhost:8070/resignation/getempRes`)
      .then((res) => {
        console.log(res.data);
        setResignations(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  // Delete Resignation by ID
  function deleteResignation(id) {
    axios
      .delete(`http://localhost:8070/resignation/deleteempRes/${id}`)
      .then(() => {
        alert("Resignation deleted successfully");
        setResignations(resignations.filter((resignation) => resignation._id !== id)); // Update UI
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Resignation List</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <ul className="list-group">
            {resignations.map((resignation) => (
              <li
                key={resignation._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>{resignation.empId}</strong> - {resignation.Reason}
                </span>
                <div>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => deleteResignation(resignation._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/update/${resignation._id}`)}
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