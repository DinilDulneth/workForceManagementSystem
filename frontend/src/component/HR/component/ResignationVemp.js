import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FetchResignations() {
  const navigate = useNavigate();
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getResignations();
  }, []);

  function getResignations() {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:8070/resignation/getempRes`, { timeout: 5000 })
      .then((res) => {
        setResignations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching resignations:", err);
        setError("Could not connect to the server. Please try again later.");
        setLoading(false);
      });
  }

  // Delete Resignation by ID
  function deleteResignation(id) {
    axios
      .delete(`http://localhost:8070/resignation/deleteempRes/${id}`)
      .then(() => {
        alert("Resignation deleted successfully");
        setResignations(
          resignations.filter((resignation) => resignation._id !== id)
        ); // Update UI
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  // Function to retry API call
  const handleRetry = () => {
    getResignations();
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p>Resignations Data</p>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading resignation data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Resignation Records</h2>

      {error && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <strong>Note:</strong> {error}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
          <div className="mt-2">
            <button className="btn btn-sm btn-primary" onClick={handleRetry}>
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Resignation Records Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Employee ID</th>
              <th>Reason</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resignations.length > 0 ? (
              resignations.map((resignation) => (
                <tr key={resignation._id}>
                  <td>{resignation.empId}</td>
                  <td>{resignation.Reason}</td>
                  <td>{new Date(resignation.endDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() =>
                        navigate(
                          `/HRDashboard/UpdateResignation/${resignation._id}`
                        )
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteResignation(resignation._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No resignation records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
