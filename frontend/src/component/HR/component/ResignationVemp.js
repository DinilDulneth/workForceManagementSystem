import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import {
  FaUserMinus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCalendarAlt,
  FaUserTie,
  FaInfoCircle,
} from "react-icons/fa";

export default function FetchResignations() {
  const navigate = useNavigate();
  const [resignations, setResignations] = useState([]);
  const [filteredResignations, setFilteredResignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resignationToDelete, setResignationToDelete] = useState(null);

  useEffect(() => {
    getResignations();
  }, []);

  useEffect(() => {
    const filtered = resignations.filter(
      (resignation) =>
        resignation.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resignation.Reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResignations(filtered);
  }, [searchTerm, resignations]);

  function getResignations() {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:8070/resignation/getempRes`, { timeout: 5000 })
      .then((res) => {
        setResignations(res.data);
        setFilteredResignations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching resignations:", err);
        setError("Could not connect to the server. Please try again later.");
        setLoading(false);
      });
  }

  function deleteResignation(id) {
    axios
      .delete(`http://localhost:8070/resignation/deleteempRes/${id}`)
      .then(() => {
        setResignations(
          resignations.filter((resignation) => resignation._id !== id)
        );
        setShowDeleteModal(false);
        const notification = document.getElementById("successNotification");
        notification.classList.add("show");
        setTimeout(() => {
          notification.classList.remove("show");
        }, 3000);
      })
      .catch((err) => {
        alert(err.message);
        setShowDeleteModal(false);
      });
  }

  const handleRetry = () => {
    getResignations();
  };

  const confirmDelete = (id) => {
    setResignationToDelete(id);
    setShowDeleteModal(true);
  };

  const getStatus = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);

    if (end < today) {
      return { status: "Completed", color: "#27ae60" };
    } else if ((end - today) / (1000 * 60 * 60 * 24) < 7) {
      return { status: "In Progress", color: "#f39c12" };
    } else {
      return { status: "Pending", color: "#3498db" };
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">
          <svg className="circular" viewBox="25 25 50 50">
            <circle
              className="path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              strokeWidth="3"
              strokeMiterlimit="10"
            />
          </svg>
        </div>
        <h3 className="loading-text">Loading Resignation Data</h3>
        <style jsx>{`
          .loading-container {
            margin-left: 250px;
            margin-top: 70px;
            height: calc(100vh - 70px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #eef2f3 100%);
          }
          .loading-text {
            margin-top: 30px;
            color: #2c3e50;
            font-weight: 500;
          }
          .loader {
            position: relative;
            width: 80px;
            height: 80px;
          }
          .circular {
            animation: rotate 2s linear infinite;
            height: 100%;
            transform-origin: center center;
            width: 100%;
          }
          .path {
            stroke: #fc6625;
            stroke-dasharray: 89, 200;
            stroke-dashoffset: 0;
            stroke-linecap: round;
            animation: dash 1.5s ease-in-out infinite;
          }
          @keyframes rotate {
            100% {
              transform: rotate(360deg);
            }
          }
          @keyframes dash {
            0% {
              stroke-dasharray: 1, 200;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 89, 200;
              stroke-dashoffset: -35px;
            }
            100% {
              stroke-dasharray: 89, 200;
              stroke-dashoffset: -124px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="main-content"
    >
      <div className="notification" id="successNotification">
        <FaCheckCircle /> Resignation record deleted successfully.
      </div>

      <div className="grid-container">
        <div className="section-title">
          <FaUserMinus className="section-icon" />
          <h2>Resignation Management</h2>
        </div>

        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Employee ID or Reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="cards-container">
          <motion.div
            className="info-card total"
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          >
            <div className="card-icon">
              <FaUserMinus />
            </div>
            <div className="card-content">
              <h4>Total Resignations</h4>
              <p className="card-number">{resignations.length}</p>
            </div>
          </motion.div>

          <motion.div
            className="info-card active"
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          >
            <div className="card-icon">
              <FaCalendarAlt />
            </div>
            <div className="card-content">
              <h4>Active Requests</h4>
              <p className="card-number">
                {
                  resignations.filter((r) => new Date(r.endDate) > new Date())
                    .length
                }
              </p>
            </div>
          </motion.div>

          <motion.div
            className="info-card processed"
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          >
            <div className="card-icon">
              <FaCheckCircle />
            </div>
            <div className="card-content">
              <h4>Processed</h4>
              <p className="card-number">
                {
                  resignations.filter((r) => new Date(r.endDate) <= new Date())
                    .length
                }
              </p>
            </div>
          </motion.div>
        </div>

        {error && (
          <div className="alert-box">
            <FaExclamationTriangle className="alert-icon" />
            <div>
              <strong>Connection Error:</strong> {error}
            </div>
            <button className="retry-btn" onClick={handleRetry}>
              Retry Connection
            </button>
          </div>
        )}

        <div className="table-container">
          <table className="resignation-table">
            <thead>
              <tr>
                <th>
                  <FaUserTie className="table-icon" /> Employee ID
                </th>
                <th>
                  <FaInfoCircle className="table-icon" /> Reason
                </th>
                <th>
                  <FaCalendarAlt className="table-icon" /> End Date
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResignations.length > 0 ? (
                filteredResignations.map((resignation) => {
                  const statusInfo = getStatus(resignation.endDate);
                  return (
                    <motion.tr
                      key={resignation._id}
                      whileHover={{
                        backgroundColor: "rgba(252, 102, 37, 0.05)",
                      }}
                    >
                      <td>{resignation.empId}</td>
                      <td className="reason-cell">
                        <div className="reason-text">{resignation.Reason}</div>
                      </td>
                      <td>
                        {new Date(resignation.endDate).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: statusInfo.color }}
                        >
                          {statusInfo.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn edit-btn"
                            title="Edit"
                            onClick={() =>
                              navigate(
                                `/HRDashboard/UpdateResignation/${resignation._id}`
                              )
                            }
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            title="Delete"
                            onClick={() => confirmDelete(resignation._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="empty-message">
                    No resignation records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-backdrop">
          <motion.div
            className="delete-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete this resignation record? This
              action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="delete-confirm-btn"
                onClick={() => deleteResignation(resignationToDelete)}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .main-content {
          margin-left: 250px;
          margin-top: 70px;
          padding: 25px;
          min-height: calc(100vh - 70px);
          background: linear-gradient(135deg, #f5f7fa 0%, #eef2f3 100%);
          transition: all 0.3s ease;
        }

        .grid-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
        }

        .section-icon {
          font-size: 28px;
          color: #fc6625;
        }

        .section-title h2 {
          color: #2c3e50;
          margin: 0;
          font-weight: 600;
          font-size: 28px;
          background: linear-gradient(45deg, #2c3e50, #4a6583);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .search-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .search-box {
          position: relative;
          width: 100%;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }

        .search-box input {
          width: 100%;
          padding: 12px 20px 12px 45px;
          border: none;
          border-radius: 50px;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          font-size: 16px;
          transition: all 0.3s;
        }

        .search-box input:focus {
          outline: none;
          box-shadow: 0 2px 20px rgba(252, 102, 37, 0.15);
        }

        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 10px;
        }

        .info-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
          border-top: 5px solid;
        }

        .info-card.total {
          border-color: #3498db;
        }

        .info-card.active {
          border-color: #f39c12;
        }

        .info-card.processed {
          border-color: #27ae60;
        }

        .card-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          background: linear-gradient(
            135deg,
            rgba(52, 152, 219, 0.1) 0%,
            rgba(52, 152, 219, 0.2) 100%
          );
          color: #3498db;
        }

        .info-card.active .card-icon {
          background: linear-gradient(
            135deg,
            rgba(243, 156, 18, 0.1) 0%,
            rgba(243, 156, 18, 0.2) 100%
          );
          color: #f39c12;
        }

        .info-card.processed .card-icon {
          background: linear-gradient(
            135deg,
            rgba(39, 174, 96, 0.1) 0%,
            rgba(39, 174, 96, 0.2) 100%
          );
          color: #27ae60;
        }

        .card-content {
          flex: 1;
        }

        .card-content h4 {
          margin: 0 0 10px 0;
          color: #34495e;
          font-size: 16px;
          font-weight: 500;
        }

        .card-number {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          color: #2c3e50;
          line-height: 1;
        }

        .info-card.total .card-number {
          color: #3498db;
        }

        .info-card.active .card-number {
          color: #f39c12;
        }

        .info-card.processed .card-number {
          color: #27ae60;
        }

        .alert-box {
          background: linear-gradient(
            135deg,
            rgba(231, 76, 60, 0.05) 0%,
            rgba(231, 76, 60, 0.1) 100%
          );
          border-left: 4px solid #e74c3c;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          color: #c0392b;
        }

        .alert-icon {
          font-size: 24px;
        }

        .retry-btn {
          margin-left: auto;
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          border: 1px solid #e74c3c;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .retry-btn:hover {
          background: #e74c3c;
          color: white;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          max-height: 600px;
          overflow-y: auto;
        }

        .resignation-table {
          width: 100%;
          border-collapse: collapse;
        }

        .resignation-table thead {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6583 100%);
          color: white;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .resignation-table th {
          padding: 16px 20px;
          text-align: left;
          font-weight: 500;
          font-size: 15px;
        }

        .table-icon {
          margin-right: 8px;
          vertical-align: middle;
        }

        .resignation-table td {
          padding: 16px 20px;
          border-top: 1px solid #ecf0f1;
          transition: all 0.2s ease;
        }

        .reason-cell {
          max-width: 300px;
        }

        .reason-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          display: inline-block;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
        }

        .edit-btn {
          background: #3498db;
        }

        .edit-btn:hover {
          background: #2980b9;
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
        }

        .delete-btn {
          background: #e74c3c;
        }

        .delete-btn:hover {
          background: #c0392b;
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
        }

        .empty-message {
          text-align: center;
          padding: 30px;
          font-style: italic;
          color: #7f8c8d;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .delete-modal {
          background: white;
          border-radius: 12px;
          padding: 25px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .delete-modal h3 {
          color: #e74c3c;
          margin-top: 0;
          margin-bottom: 15px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 25px;
        }

        .cancel-btn {
          padding: 10px 20px;
          border-radius: 6px;
          border: 1px solid #dce1e5;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .cancel-btn:hover {
          background: #f5f7fa;
        }

        .delete-confirm-btn {
          padding: 10px 20px;
          border-radius: 6px;
          border: none;
          background: #e74c3c;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .delete-confirm-btn:hover {
          background: #c0392b;
        }

        .notification {
          position: fixed;
          top: 20px;
          right: -350px;
          background: #27ae60;
          color: white;
          padding: 15px 25px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 12px rgba(39, 174, 96, 0.2);
          transition: right 0.5s ease;
          z-index: 1001;
        }

        .notification.show {
          right: 20px;
        }

        @media (max-width: 992px) {
          .main-content {
            margin-left: 0;
          }

          .cards-container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .search-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .search-box {
            max-width: 100%;
          }
        }
      `}</style>
    </motion.div>
  );
}
