import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaSearch, FaFilter, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ApprovedLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDepartment, setFilterDepartment] = useState("");
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

    useEffect(() => {
        fetchApprovedLeaves();
    }, []);

    const fetchApprovedLeaves = async () => {
        try {
            const response = await axios.get("/leave");
            // Filter only approved leaves
            const approvedLeaves = response.data.filter(leave => leave.status === "approved");
            setLeaves(approvedLeaves);
        } catch (error) {
            console.error("Error fetching approved leaves:", error);
            toast.error("Failed to fetch approved leaves");
        }
    };

    // Function to generate PDF
    const generatePDF = () => {
        setIsGeneratingPDF(true);

        try {
            // Create a new PDF document
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // Add header with company name
            doc.setFontSize(24);
            doc.setTextColor(44, 62, 80); // #2c3e50
            doc.text("WorkForce", pageWidth / 2, 20, { align: "center" });

            // Add subtitle
            doc.setFontSize(16);
            doc.setTextColor(100, 100, 100);
            doc.text("Human Resources Department", pageWidth / 2, 30, { align: "center" });

            // Add title
            doc.setFontSize(20);
            doc.setTextColor(44, 62, 80);
            doc.text("Approved Leaves Report", pageWidth / 2, 40, { align: "center" });

            // Add date
            const today = new Date();
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated on: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`, pageWidth / 2, 48, {
                align: "center",
            });

            // Add summary
            doc.setFontSize(12);
            doc.setTextColor(44, 62, 80);
            doc.text(`Total Approved Leaves: ${leaves.length}`, 14, 60);
            doc.text(`Sick Leaves: ${leaves.filter(l => l.leavetype === "Sick Leave").length}`, 14, 68);
            doc.text(`Casual Leaves: ${leaves.filter(l => l.leavetype === "Casual Leave").length}`, 14, 76);
            doc.text(`Annual Leaves: ${leaves.filter(l => l.leavetype === "Annual Leave").length}`, 14, 84);
            doc.text(`Half Day Leaves: ${leaves.filter(l => l.leavetype === "Half Day").length}`, 14, 92);

            // Format data for the table
            const tableData = leaves.map(leave => [
                leave.id,
                leave.department,
                leave.leavetype,
                leave.leavetype === "Half Day" ? leave.session : "-",
                new Date(leave.date).toLocaleDateString(),
                leave.status
            ]);

            // Add the table
            doc.autoTable({
                startY: 100,
                head: [["Employee ID", "Department", "Leave Type", "Session", "Date", "Status"]],
                body: tableData,
                theme: "striped",
                headStyles: {
                    fillColor: [44, 62, 80], // #2c3e50
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240],
                },
                styles: {
                    fontSize: 10,
                },
            });

            // Add search filter info if applied
            if (searchTerm || filterDepartment) {
                const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 100;
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                let filterText = "Filtered by: ";
                if (searchTerm) filterText += `Search term "${searchTerm}"`;
                if (filterDepartment) {
                    if (searchTerm) filterText += " and ";
                    filterText += `Department "${filterDepartment}"`;
                }
                doc.text(filterText, 14, finalY + 10);
            }

            // Save the PDF
            const fileName = `approved_leaves_report_${today.toISOString().split("T")[0]}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    // Filter leaves based on search term and department
    const filteredLeaves = leaves.filter(leave => {
        const matchesSearch =
            leave.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            leave.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            leave.leavetype.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDepartment =
            !filterDepartment || leave.department === filterDepartment;

        return matchesSearch && matchesDepartment;
    });

    return (
        <div className="container" style={{ marginLeft: "350px", paddingTop: "70px", paddingRight: "30px" }}>
            <Toaster position="top-right" />

            <div className="card">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Approved Leaves Dashboard</h4>
                    <button
                        className="btn btn-light btn-sm"
                        onClick={generatePDF}
                        disabled={isGeneratingPDF}
                        title="Export to PDF"
                    >
                        <FaFilePdf className="me-2" />
                        {isGeneratingPDF ? "Generating..." : "Export PDF"}
                    </button>
                </div>
                <div className="card-body">
                    {/* Search and Filter Section */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaSearch />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by ID, Department, or Leave Type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaFilter />
                                </span>
                                <select
                                    className="form-select"
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                >
                                    <option value="">All Departments</option>
                                    {departments.map((dept) => (
                                        <option key={dept} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="card bg-success text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Total Approved Leaves</h5>
                                    <h2 className="card-text">{leaves.length}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-info text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Sick Leaves</h5>
                                    <h2 className="card-text">
                                        {leaves.filter(leave => leave.leavetype === "Sick Leave").length}
                                    </h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-warning text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Casual Leaves</h5>
                                    <h2 className="card-text">
                                        {leaves.filter(leave => leave.leavetype === "Casual Leave").length}
                                    </h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-primary text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Annual Leaves</h5>
                                    <h2 className="card-text">
                                        {leaves.filter(leave => leave.leavetype === "Annual Leave").length}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leaves Table */}
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Department</th>
                                    <th>Leave Type</th>
                                    <th>Session</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.map((leave) => (
                                    <tr key={leave._id}>
                                        <td>#{leave.id}</td>
                                        <td>{leave.department}</td>
                                        <td>
                                            <span className={`badge bg-${leave.leavetype === "Sick Leave" ? "danger" :
                                                leave.leavetype === "Casual Leave" ? "warning" :
                                                    "success"
                                                }`}>
                                                {leave.leavetype}
                                            </span>
                                        </td>
                                        <td>{leave.leavetype === "Half Day" ? leave.session : "-"}</td>
                                        <td>{new Date(leave.date).toLocaleDateString()}</td>
                                        <td>
                                            <span className="badge bg-success">
                                                {leave.status}
                                            </span>
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