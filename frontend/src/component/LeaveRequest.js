import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
            <Toaster position="top-right" />
            <div className="card mb-4">
                <div className="card-header">
                    <h4 className="mb-0">
                        {isEditing ? "Edit Leave Request" : "Submit Leave Request"}
                    </h4>
                </div>
                <div className="card-body">
                    <Formik
                        innerRef={formikRef}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Employee ID</label>
                                            <Field
                                                type="number"
                                                name="id"
                                                className={`form-control ${errors.id && touched.id ? 'is-invalid' : ''}`}
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

                                <div className="mt-4 text-end">
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditId(null);
                                                formikRef.current?.resetForm();
                                            }}
                                            className="btn btn-secondary me-2"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn btn-primary"
                                    >
                                        {isSubmitting ? 'Processing...' : isEditing ? 'Update Request' : 'Submit Request'}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="mb-0">Leave Requests</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Department</th>
                                    <th>Leave Type</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave) => (
                                    <tr key={leave._id}>
                                        <td>{leave.id}</td>
                                        <td>{leave.department}</td>
                                        <td>{leave.leavetype}</td>
                                        <td>{new Date(leave.date).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                onClick={() => handleEdit(leave)}
                                                className="btn btn-sm btn-primary me-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(leave._id)}
                                                className="btn btn-sm btn-danger"
                                            >
                                                Delete
                                            </button>
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