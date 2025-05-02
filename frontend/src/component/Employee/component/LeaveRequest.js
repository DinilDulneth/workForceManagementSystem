import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { FaEdit, FaTrash, FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient('https://gfecuythmlxooltvkjxq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZWN1eXRobWx4b29sdHZranhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTMxODMsImV4cCI6MjA2MTA2OTE4M30.BI7q49sHAgJIjLQ_VTYEOYdNOVgc88qMJe6jNg1uQ4E');

// Axios configuration
axios.defaults.baseURL = "http://localhost:8070";
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Create a separate component for the form to access Formik context
const LeaveRequestForm = ({ isEditing, editId, setIsEditing, setEditId }) => {
  const formik = useFormikContext();

  const handleEdit = (leave) => {
    setIsEditing(true);
    setEditId(leave._id);
    // Set form values for editing
    formik.setValues({
      department: leave.department,
      leavetype: leave.leavetype,
      date: leave.date,
      session: leave.session || ""
    });
  };

  return null; // This component only provides the handleEdit function
};

export default function LeaveRequest() {
  const [leaves, setLeaves] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const formikRef = useRef(null);
  const [leaveBalance, setLeaveBalance] = useState({
    labels: ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Half Day'],
    datasets: [
      {
        data: [7, 7, 8, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });
  const [processedLeaves, setProcessedLeaves] = useState(new Set());

  const departments = [
    "Human Resources",
    "Finance",
    "IT",
    "Sales",
    "Marketing",
    "Customer Service",
    "Operations",
    "Administration",
    "Legal",
    "Research & Development"
  ];

  const initialValues = {
    department: "",
    leavetype: "",
    date: "",
    session: ""
  };

  const validationSchema = Yup.object().shape({
    department: Yup.string().required("Department is required"),
    leavetype: Yup.string().required("Leave type is required"),
    date: Yup.date()
      .required("Date is required")
      .min(new Date(), "Cannot select past dates")
      .typeError("Please enter a valid date"),
    session: Yup.string().test('session-required', 'Session is required for half day leave', function (value) {
      if (this.parent.leavetype === 'Half Day') {
        return value && value.length > 0;
      }
      return true;
    })
  });

  // Function to update leave balance
  const updateLeaveBalance = (leavetype, addBack = false) => {
    setLeaveBalance(prevBalance => {
      const newData = [...prevBalance.datasets[0].data];
      const index = prevBalance.labels.indexOf(leavetype);

      if (index !== -1) {
        if (addBack) {
          newData[index] += 1;
        } else if (newData[index] > 0) {
          newData[index] -= 1;
        }

        const newDataset = {
          ...prevBalance.datasets[0],
          data: newData
        };

        return {
          ...prevBalance,
          datasets: [newDataset]
        };
      }
      return prevBalance;
    });
  };

  // Function to check if leave is available
  const isLeaveAvailable = (leavetype) => {
    const index = leaveBalance.labels.indexOf(leavetype);
    return index !== -1 && leaveBalance.datasets[0].data[index] > 0;
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      // Check if leave is available
      if (!isLeaveAvailable(values.leavetype)) {
        toast.error(`No ${values.leavetype} days remaining`);
        setSubmitting(false);
        return;
      }

      const response = await axios.post("/leave/add", {
        ...values,
        employeeId: employeeId
      });

      if (response.data) {
        toast.success("Leave request submitted successfully!");
        resetForm();
        fetchLeaves();
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
      toast.error("Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (leaveId) => {
    if (window.confirm("Are you sure you want to delete this leave request?")) {
      try {
        const response = await axios.delete(`/leave/delete/${leaveId}`);
        if (response.data) {
          toast.success("Leave request deleted successfully");
          // Only update leave balance if the deleted leave was approved
          const deletedLeave = leaves.find(l => l._id === leaveId);
          if (deletedLeave && deletedLeave.status === "approved") {
            updateLeaveBalance(deletedLeave.leavetype, true); // true means add back the leave
          }
          fetchLeaves();
        }
      } catch (error) {
        console.error("Error deleting leave:", error);
        toast.error("Failed to delete leave request");
      }
    }
  };

  const handleUpdate = async (values, { resetForm, setSubmitting }) => {
    try {
      console.log("Updating leave with values:", values);

      const formData = new FormData();
      formData.append('employeeId', employeeId);
      formData.append('department', values.department);
      formData.append('leavetype', values.leavetype);
      formData.append('date', values.date);
      formData.append('session', values.session || '');
      formData.append('medicalCertificate', values.medicalCertificate || '');

      // Add image if it's a sick leave and a new image is selected
      if (values.leavetype === 'Sick Leave' && values.image) {
        formData.append('image', values.image);
      }

      console.log("Sending update request to:", `/leave/update/${editId}`);

      const response = await axios.put(`http://localhost:8070/leave/update/${editId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Update response:", response.data);

      if (response.data) {
        toast.success("Leave request updated successfully!");
        setIsEditing(false);
        setEditId(null);
        resetForm();
        fetchLeaves();
      }
    } catch (error) {
      console.error("Error updating leave:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        toast.error(error.response.data.error || "Failed to update leave request");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        toast.error("No response received from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        toast.error("Error setting up the request");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all leave requests? This action cannot be undone.")) {
      try {
        // Get all pending leave requests
        const pendingLeaves = leaves.filter(leave => !leave.status || leave.status === "pending");

        // Delete each pending leave request
        for (const leave of pendingLeaves) {
          await axios.delete(`/leave/delete/${leave._id}`);
        }

        toast.success("All leave requests have been deleted successfully");
        fetchLeaves(); // Refresh the list
      } catch (error) {
        console.error("Error deleting leave requests:", error);
        toast.error("Failed to delete leave requests");
      }
    }
  };

  const handleDeleteAllApproved = async () => {
    if (window.confirm("Are you sure you want to delete all approved leave requests? This action cannot be undone.")) {
      try {
        // Get all approved leave requests
        const approvedLeaves = leaves.filter(leave => leave.status === "approved");

        // Delete each approved leave request and update balance
        for (const leave of approvedLeaves) {
          await axios.delete(`/leave/delete/${leave._id}`);
          // Add back the leave balance for each deleted approved leave
          updateLeaveBalance(leave.leavetype, true);
        }

        toast.success("All approved leave requests have been deleted successfully");
        fetchLeaves(); // Refresh the list
      } catch (error) {
        console.error("Error deleting approved leave requests:", error);
        toast.error("Failed to delete approved leave requests");
      }
    }
  };

  useEffect(() => {
    fetchEmployeeId();
    fetchLeaves();
  }, []);

  const fetchEmployeeId = async () => {
    try {
      const response = await axios.get(`/employee/getEmpByID/${localStorage.getItem("ID")}`);
      if (response.data && response.data.ID) {
        setEmployeeId(response.data.ID);
      }
    } catch (error) {
      console.error("Error fetching employee ID:", error);
      toast.error("Failed to fetch employee ID");
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("/leave");
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.error("Failed to fetch leave requests");
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} days remaining`;
          }
        }
      }
    },
    cutout: '70%'
  };

  const handleEditClick = (leave) => {
    setIsEditing(true);
    setEditId(leave._id);
    // Format the date to YYYY-MM-DD for the date input
    const formattedDate = new Date(leave.date).toISOString().split('T')[0];

    // Set form values for editing
    if (formikRef.current) {
      formikRef.current.setValues({
        department: leave.department,
        leavetype: leave.leavetype,
        date: formattedDate,
        session: leave.session || ""
      });
    }
  };

  // Add useEffect to listen for leave status changes
  useEffect(() => {
    const checkLeaveStatusChanges = () => {
      leaves.forEach(leave => {
        // Only process if the leave is approved and hasn't been processed before
        if (leave.status === "approved" && !processedLeaves.has(leave._id)) {
          // Update the balance for this specific leave type
          updateLeaveBalance(leave.leavetype);
          // Add this leave to the processed set
          setProcessedLeaves(prev => new Set([...prev, leave._id]));
        }
      });
    };

    checkLeaveStatusChanges();
  }, [leaves]);

  return (
    <div className="container" style={{ marginLeft: "250px", paddingTop: "70px", paddingRight: "30px" }}>
      <Toaster position="top-right" />

      {/* Employee ID Display Card */}
      {employeeId && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Your Employee ID</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center">
              <span className="badge bg-primary fs-5 me-3">{employeeId}</span>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  navigator.clipboard.writeText(employeeId);
                  toast.success('ID copied to clipboard!');
                }}
              >
                Copy ID
              </button>
            </div>
            <small className="text-muted mt-2 d-block">
              Please save this ID for future reference. You'll need it to track your leave requests.
            </small>
          </div>
        </div>
      )}

      {/* Leave Balance Card */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Leave Balance</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div style={{ height: '300px' }}>
                <Doughnut data={leaveBalance} options={chartOptions} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-column justify-content-center h-100">
                <h6 className="mb-3">Remaining Leave Days</h6>
                <div className="d-flex flex-wrap gap-3">
                  {leaveBalance.labels.map((label, index) => (
                    <div key={label} className="leave-count-card p-3 rounded"
                      style={{
                        backgroundColor: leaveBalance.datasets[0].backgroundColor[index],
                        color: 'white',
                        minWidth: '120px'
                      }}>
                      <div className="fw-bold">{label}</div>
                      <div className="fs-4">{leaveBalance.datasets[0].data[index]} days</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={isEditing ? handleUpdate : handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, values }) => (
          <>
            <LeaveRequestForm
              isEditing={isEditing}
              editId={editId}
              setIsEditing={setIsEditing}
              setEditId={setEditId}
            />
            <Form>
              <div className="row g-4">
                {/* Employee ID Field */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Employee ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={employeeId || "Not available"}
                      readOnly
                    />
                  </div>
                </div>

                {/* Department Dropdown */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <Field
                      as="select"
                      name="department"
                      className="form-select"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="department"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>
                </div>

                {/* Leave Type */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Leave Type</label>
                    <Field
                      as="select"
                      name="leavetype"
                      className="form-select"
                    >
                      <option value="">Select Leave Type</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Half Day">Half Day</option>
                    </Field>
                  </div>
                </div>

                {/* Session Field - Only visible for Half Day */}
                {values.leavetype === "Half Day" && (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Session</label>
                      <Field
                        as="select"
                        name="session"
                        className="form-select"
                      >
                        <option value="">Select Session</option>
                        <option value="Morning">Morning Session</option>
                        <option value="Evening">Evening Session</option>
                      </Field>
                      <ErrorMessage
                        name="session"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Date */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <Field
                      type="date"
                      name="date"
                      className="form-control"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="loading-spinner me-2" />
                      Processing...
                    </>
                  ) : isEditing ? (
                    "Update Leave Request"
                  ) : (
                    "Submit Leave Request"
                  )}
                </button>
              </div>
            </Form>
          </>
        )}
      </Formik>

      <div className="leave-card mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Leave Requests</h4>
          <div>
            <button
              onClick={handleDeleteAllApproved}
              className="btn btn-danger btn-sm me-2"
              disabled={!leaves.some(leave => leave.status === "approved")}
            >
              <FaTrash /> Delete All Approved
            </button>
            <span className="badge bg-primary rounded-pill">
              {leaves.length} Requests
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table leave-table m-0">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>ID</th>
                  <th style={{ width: "15%" }}>Department</th>
                  <th style={{ width: "15%" }}>Leave Type</th>
                  <th style={{ width: "15%" }}>Session</th>
                  <th style={{ width: "15%" }}>Date</th>
                  <th style={{ width: "15%" }}>Status</th>
                  <th style={{ width: "15%" }} className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td><span className="fw-bold">#{leave.employeeId}</span></td>
                    <td>{leave.department}</td>
                    <td>{leave.leavetype}</td>
                    <td>{leave.leavetype === "Half Day" ? leave.session : "-"}</td>
                    <td>{new Date(leave.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge bg-${leave.status === "approved" ? "success" : leave.status === "rejected" ? "danger" : "warning"}`}>
                        {leave.status || "pending"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group">
                        {(!leave.status || leave.status === "pending") && (
                          <>
                            <button
                              onClick={() => handleEditClick(leave)}
                              className="btn btn-sm btn-leave-secondary me-2"
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(leave._id)}
                              className="btn btn-sm btn-danger"
                            >
                              <FaTrash /> Delete
                            </button>
                          </>
                        )}
                      </div>
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