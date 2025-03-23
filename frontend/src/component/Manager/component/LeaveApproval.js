import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function LeaveApproval() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8070/leave");
      setLeaveRequests(response.data);
    } catch (error) {
      toast.error("Failed to fetch leave requests");
    }
  };

  const handleApproval = async (id, status, employeeId, department) => {
    try {
      await axios.put(`http://localhost:8070/leave/status/${id}`, { status });

      // Create notification message
      const message =
        status === "approved"
          ? `Leave request for Employee #${employeeId} from ${department} has been approved`
          : `Leave request for Employee #${employeeId} from ${department} has been rejected`;

      // Add notification to the list
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          message,
          type: status === "approved" ? "success" : "danger",
          timestamp: new Date()
        }
      ]);

      toast.success(`Leave request ${status}`);
      fetchLeaveRequests();
    } catch (error) {
      toast.error("Failed to update leave status");
    }
  };

  return (
    <div
      className="container-fluid"
      style={{ width: "1250px", marginLeft: "265px", marginTop: "100px" }}
    >
      <style>
        {`
                .btn-group .btn {
                    padding: 0.4rem 0.8rem;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn-group .btn svg {
                    width: 14px;
                    height: 14px;
                }

                .badge-leave-status {
                    min-width: 100px;
                    text-align: center;
                }

                .leave-table td {
                    vertical-align: middle;
                }

                .leave-card {
                    margin-bottom: 2rem;
                }

                .status-pending {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% {
                        opacity: 1;
                    }

                    50% {
                        opacity: 0.6;
                    }

                    100% {
                        opacity: 1;
                    }
                }

                .notification-list {
                    max-height: 300px;
                    overflow-y: auto;
                }

                .notification-list .alert {
                    margin-bottom: 0.5rem;
                    padding: 1rem;
                    border-left: 4px solid;
                }

                .notification-list .alert:last-child {
                    margin-bottom: 0;
                }

                .alert-success {
                    border-left-color:rgb(120, 234, 26);
                }

                .alert-danger {
                    border-left-color:rgb(28, 15, 81);
                }

                .table td {
                    vertical-align: middle;
                }

                .badge {
                    font-weight: 500;
                    padding: 0.5em 0.8em;
                }

                .btn-sm {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                `}
      </style>
      <Toaster position="top-right" />

      {/* Notifications Panel */}
      <div className="card mb-4 ml-5">
        <div className="card-header bg-primary text-white"></div>
        <div className="card-body">
          {notifications.length > 0 ? (
            <div className="notification-list">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`alert alert-${notif.type} d-flex align-items-center`}
                >
                  <div className="flex-grow-1">
                    {notif.message}
                    <small className="d-block text-muted">
                      {new Date(notif.timestamp).toLocaleString()}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.filter((n) => n.id !== notif.id)
                      )
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted mb-0">No notifications yet</p>
          )}
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Leave Requests</h4>
          <div>
            <span className="badge bg-warning me-2">
              {
                leaveRequests.filter(
                  (req) => !req.status || req.status === "pending"
                ).length
              }{" "}
              Pending
            </span>
            <span className="badge bg-success me-2">
              {leaveRequests.filter((req) => req.status === "approved").length}{" "}
              Approved
            </span>
            <span className="badge bg-danger">
              {leaveRequests.filter((req) => req.status === "rejected").length}{" "}
              Rejected
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => (
                  <tr key={request._id}>
                    <td>#{request.id}</td>
                    <td>{request.department}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          request.leavetype === "Sick Leave"
                            ? "danger"
                            : request.leavetype === "Casual Leave"
                            ? "warning"
                            : "success"
                        }`}
                      >
                        {request.leavetype}
                      </span>
                    </td>
                    <td>{new Date(request.date).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          request.status === "approved"
                            ? "primary"
                            : request.status === "rejected"
                            ? "danger"
                            : "warning"
                        }`}
                      >
                        {request.status || "pending"}
                      </span>
                    </td>
                    <td>
                      {(!request.status || request.status === "pending") && (
                        <div className="d-flex gap-2">
                          <button
                            onClick={() =>
                              handleApproval(
                                request._id,
                                "approved",
                                request.id,
                                request.department
                              )
                            }
                            className="btn btn-success btn-sm"
                          >
                            <FaCheck className="me-1" /> Accept
                          </button>
                          <button
                            onClick={() =>
                              handleApproval(
                                request._id,
                                "rejected",
                                request.id,
                                request.department
                              )
                            }
                            className="btn btn-danger btn-sm"
                          >
                            <FaTimes className="me-1" /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
