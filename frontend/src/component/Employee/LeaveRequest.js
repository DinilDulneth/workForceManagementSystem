import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEdit, FaTrash, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';

// Add axios default configuration
axios.defaults.baseURL = 'http://localhost:8070';

const validationSchema = Yup.object({
    id: Yup.number()
        .required("Employee ID is required")
        .positive("ID must be positive"),
    department: Yup.string()
        .required("Department is required")
        .min(2, "Department must be at least 2 characters"),
    leavetype: Yup.string()
        .required("Leave type is required"),
    date: Yup.date()
        .required("Date is required")
        .min(new Date(), "Date cannot be in the past"),
});

export default function LeaveRequest() {
    const [leaves, setLeaves] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const formikRef = React.useRef();

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await axios.get("/leave");
            if (response.data) {
                setLeaves(response.data);
            }
        } catch (error) {
            console.error("Error fetching leaves:", error);
            toast.error(error.response?.data?.error || "Failed to fetch leave requests");
        }
    };

    const handleEdit = (leave) => {
        setIsEditing(true);
        setEditId(leave._id);
        const formValues = {
            id: leave.id,
            department: leave.department,
            leavetype: leave.leavetype,
            date: new Date(leave.date).toISOString().split('T')[0],
            medicalCertificate: leave.medicalCertificate || "",
        };
        formikRef.current?.setValues(formValues);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/leave/delete/${id}`);
            if (response.data) {
                toast.success("Leave request deleted successfully!");
                fetchLeaves();
            }
        } catch (error) {
            console.error("Error deleting leave:", error);
            toast.error(error.response?.data?.error || "Error deleting leave request");
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`/leave/status/${id}`, { status });
            toast.success(`Leave request ${status}`);
            fetchLeaves();
        } catch (error) {
            toast.error("Failed to update leave status");
        }
    };

    const initialValues = {
        id: "",
        department: "",
        leavetype: "",
        date: "",
        medicalCertificate: "",
    };

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            if (isEditing) {
                const response = await axios.put(`/leave/update/${editId}`, values);
                if (response.data) {
                    toast.success("Leave request updated successfully!");
                }
            } else {
                const response = await axios.post("/leave/add", values);
                if (response.data) {
                    toast.success("Leave request submitted successfully!");
                }
            }
            resetForm();
            setIsEditing(false);
            setEditId(null);
            fetchLeaves();
        } catch (error) {
            console.error("Error submitting leave:", error);
            toast.error(error.response?.data?.error || "Error processing request");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
            <div className="leave-card mb-4">
                <div className="card-header">
                    <h4 className="mb-0 d-flex align-items-center">
                        {isEditing ? (
                            <><FaEdit className="me-2" /> Edit Leave Request</>
                        ) : (
                            <>New Leave Request</>
                        )}
                    </h4>
                </div>
                <div className="leave-form-container">
                    <Formik
                        innerRef={formikRef}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Employee ID</label>
                                            <Field
                                                type="number"
                                                name="id"
                                                className={`form-control ${errors.id && touched.id ? 'is-invalid' : ''}`}
                                                placeholder="Enter employee ID"
                                            />
                                            <ErrorMessage
                                                name="id"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Department</label>
                                            <Field
                                                type="text"
                                                name="department"
                                                className={`form-control ${errors.department && touched.department ? 'is-invalid' : ''}`}
                                            />
                                            <ErrorMessage
                                                name="department"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Leave Type</label>
                                            <Field
                                                as="select"
                                                name="leavetype"
                                                className={`form-select ${errors.leavetype && touched.leavetype ? 'is-invalid' : ''}`}
                                            >
                                                <option value="">Select Leave Type</option>
                                                <option value="Sick Leave">Sick Leave</option>
                                                <option value="Casual Leave">Casual Leave</option>
                                                <option value="Annual Leave">Annual Leave</option>
                                            </Field>
                                            <ErrorMessage
                                                name="leavetype"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Date</label>
                                            <Field
                                                type="date"
                                                name="date"
                                                className={`form-control ${errors.date && touched.date ? 'is-invalid' : ''}`}
                                            />
                                            <ErrorMessage
                                                name="date"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="d-flex justify-content-end gap-3">
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setEditId(null);
                                                    formikRef.current?.resetForm();
                                                }}
                                                className="btn btn-leave-secondary"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn btn-leave-primary"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <FaSpinner className="loading-spinner" />
                                                    Processing...
                                                </>
                                            ) : isEditing ? (
                                                'Update Request'
                                            ) : (
                                                'Submit Request'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            <div className="leave-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Leave Requests</h4>
                    <span className="badge bg-primary rounded-pill">
                        {leaves.length} Requests
                    </span>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table leave-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Department</th>
                                    <th>Leave Type</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave) => (
                                    <tr key={leave._id}>
                                        <td>
                                            <span className="fw-bold">#{leave.id}</span>
                                        </td>
                                        <td>{leave.department}</td>
                                        <td>
                                            <span className={`badge badge-leave-status bg-${leave.leavetype === 'Sick Leave' ? 'danger' :
                                                leave.leavetype === 'Casual Leave' ? 'warning' :
                                                    'success'
                                                }`}>
                                                {leave.leavetype}
                                            </span>
                                        </td>
                                        <td>{new Date(leave.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}</td>
                                        <td>
                                            <span className={`badge bg-${leave.status === 'approved' ? 'success' :
                                                    leave.status === 'rejected' ? 'danger' :
                                                        'warning'
                                                }`}>
                                                {leave.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-group">
                                                {!leave.status && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(leave._id, 'approved')}
                                                            className="btn btn-sm btn-success me-2"
                                                            title="Approve"
                                                        >
                                                            <FaCheck /> Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(leave._id, 'rejected')}
                                                            className="btn btn-sm btn-danger me-2"
                                                            title="Reject"
                                                        >
                                                            <FaTimes /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(leave)}
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}