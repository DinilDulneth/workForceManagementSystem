import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateManager() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [manager, setManager] = useState({
        name: "",
        department: "",
        email: "",
        phone: "",
        dateOfJoining: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchManager = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/manager/getManagerByID/${id}`);
                const managerData = response.data;
                setManager({
                    ...managerData,
                    dateOfJoining: new Date(managerData.dateOfJoining).toISOString().split('T')[0]
                });
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch manager data");
                setLoading(false);
                toast.error("Error fetching manager data");
            }
        };

        fetchManager();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setManager(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:8070/manager/updateManager/${id}`, manager);
            toast.success("Manager updated successfully!");
            navigate('/HRDashboard/fetchManager'); // Adjust this route as needed
        } catch (err) {
            toast.error("Failed to update manager");
            console.error("Update error:", err);
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading manager data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.mainContent}>
            <div style={styles.formContainer}>
                <h2 style={styles.header}>
                    Update Manager
                    <span style={styles.headerUnderline}></span>
                </h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div className="mb-3">
                        <label className="form-label">Manager ID:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={manager.ID || ''}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={manager.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Department:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="department"
                            value={manager.department}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={manager.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phone:</label>
                        <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={manager.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Date of Joining:</label>
                        <input
                            type="date"
                            className="form-control"
                            name="dateOfJoining"
                            value={manager.dateOfJoining}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div style={styles.buttonContainer}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/HRDashboard/fetchManager')}
                            style={styles.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={styles.submitButton}
                        >
                            Update Manager
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    mainContent: {
        marginLeft: "250px",
        marginTop: "70px",
        padding: "25px",
        backgroundColor: "#f8f9fa",
        minHeight: "calc(100vh - 70px)"
    },
    formContainer: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "30px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
    },
    header: {
        color: "#2c3e50",
        textAlign: "center",
        marginBottom: "30px",
        position: "relative",
        paddingBottom: "15px"
    },
    headerUnderline: {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "80px",
        height: "3px",
        backgroundColor: "#fc6625"
    },
    form: {
        marginTop: "30px"
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "30px"
    },
    cancelButton: {
        backgroundColor: "#6c757d",
        border: "none",
        padding: "10px 20px"
    },
    submitButton: {
        backgroundColor: "#fc6625",
        border: "none",
        padding: "10px 20px"
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 70px)",
        marginLeft: "250px"
    },
    errorContainer: {
        marginLeft: "250px",
        marginTop: "70px",
        padding: "25px"
    }
};