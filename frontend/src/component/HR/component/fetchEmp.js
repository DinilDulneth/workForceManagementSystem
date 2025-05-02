import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faFilePdf,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

// Import CSS Module
import styles from "./fetchEmp.module.css";

export default function FetchEmp() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [advancedSearch, setAdvancedSearch] = useState(false);

  useEffect(() => {
    getEmployee();
  }, []);

  function getEmployee() {
    setLoading(true);
    setError(null);

    const fetchPromise = axios.get("http://localhost:8070/employee/getEmp", {
      timeout: 5000,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000)
    );

    Promise.race([fetchPromise, timeoutPromise])
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        setError("Could not connect to the server. Please try again.");
        setLoading(false);
      });
  }

  const handleRetry = () => {
    getEmployee();
  };

  // Filter employees based on search criteria
  const filteredEmployees = employees.filter((employee) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    switch (searchField) {
      case "id":
        return employee.ID?.toLowerCase().includes(term);
      case "name":
        return employee.name?.toLowerCase().includes(term);
      case "email":
        return employee.email?.toLowerCase().includes(term);
      case "position":
        return employee.position?.toLowerCase().includes(term);
      case "department":
        return employee.department?.toLowerCase().includes(term);
      case "all":
      default:
        return Object.values(employee).some((value) =>
          String(value).toLowerCase().includes(term)
        );
    }
  });

  const downloadEmployeesAsPDF = () => {
    try {
      toast.info("Preparing employee list PDF...", {
        position: "top-right",
        autoClose: 2000,
      });

      const doc = new jsPDF();

      // Add title and header
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      doc.text("Employee List Report", 14, 15);

      // Add date
      doc.setFontSize(10);
      doc.setTextColor(108, 117, 125);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

      const tableColumn = [
        "Employee ID",
        "Name",
        "Position",
        "Department",
        "Email",
        "Phone",
        "JoinDate",
        "Status",
      ];

      const tableRows = filteredEmployees.map((employee) => [
        employee.ID || "N/A",
        employee.name || "N/A",
        employee.position || "N/A",
        employee.department || "N/A",
        employee.email || "N/A",
        employee.phone || "N/A",
        employee.dateOfJoining
          ? new Date(employee.dateOfJoining).toLocaleDateString()
          : "N/A",
        employee.availability === "1" || employee.availability === 1
          ? "Active"
          : "Inactive",
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [252, 102, 37],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Employee ID
          1: { cellWidth: 25 }, // Name
          2: { cellWidth: 25 }, // Position
          3: { cellWidth: 25 }, // Department
          4: { cellWidth: 30 }, // Email
          5: { cellWidth: 20 }, // Phone
          6: { cellWidth: 20 }, // JoinDate
          7: { cellWidth: 20 }, // Status
        },
        margin: { top: 35 },
      });

      doc.save(`Employee_List_${new Date().toISOString().split("T")[0]}.pdf`);
      //doc.save(`HR_Officer_${new Date().toISOString().split('T')[0]}.pdf`);

      toast.success("PDF downloaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Failed to generate PDF. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleStatusChange = (id, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;

    if (
      window.confirm("Are you sure you want to change this employee's status?")
    ) {
      axios
        .patch(`http://localhost:8070/employee/updateActiveStatus/${id}`, {
          availability: newStatus === "active" ? "1" : "0",
        })
        .then(() => {
          toast.success("Employee status updated successfully");
          getEmployee(); // Refresh the list
        })
        .catch((err) => {
          console.error("Status update error:", err);
          toast.error("Failed to update employee status");
        });
    }
  };

  if (loading) {
    return (
      <div className={styles.mainContent}>
        <div className={styles.loadingContainer}>
          <h3 className={styles.header}>
            Employees Data
            <span className={styles.headerUnderline}></span>
          </h3>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className={styles.loadingText}>Loading employee data...</p>
        </div>
      </div>
    );
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(`http://localhost:8070/employee/deleteEmp/${id}`)
        .then(() => {
          toast.success("Employee deleted successfully");
          getEmployee(); // Refresh the list
        })
        .catch((err) => {
          console.error("Delete error:", err);
          toast.error("Failed to delete employee");
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/HRDashboard/updateEmployee/${id}`);
  };

  return (
    <div className={styles.mainContent}>
      <h2 className={styles.header}>
        Employees Data
        <span className={styles.headerUnderline}></span>
      </h2>

      <div className={styles.searchContainer}>
        <div className={styles.searchControls}>
          <button
            className={`${styles.advancedSearchButton} ${
              advancedSearch
                ? styles.advancedSearchButtonActive
                : styles.advancedSearchButtonInactive
            }`}
            onClick={() => setAdvancedSearch(!advancedSearch)}
          >
            <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
            Filter
          </button>

          <div className={styles.searchWrapper}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={`Search ${
                searchField === "all" ? "employees" : searchField
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <button
            onClick={downloadEmployeesAsPDF}
            className={`${styles.pdfButton} ${
              filteredEmployees.length === 0 ? styles.pdfButtonDisabled : ""
            }`}
            disabled={filteredEmployees.length === 0}
          >
            <FontAwesomeIcon icon={faFilePdf} className={styles.filterIcon} />
            Export PDF
          </button>
        </div>

        {advancedSearch && (
          <div className={styles.searchOptions}>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className={styles.searchSelect}
            >
              <option value="all">All Fields</option>
              <option value="id">Employee ID</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="position">Position</option>
              <option value="department">Department</option>
            </select>
          </div>
        )}
      </div>

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

      <div className={styles.cardContainer}>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <div
              key={employee._id}
              className={styles.employeeCard}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderContent}>
                  <h6 style={{ margin: 0 }}>{employee.name}</h6>
                  <div className={styles.headerActions}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className={styles.editIcon}
                      onClick={() => handleEdit(employee._id)}
                      title="Edit Employee"
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className={styles.deleteIcon}
                      onClick={() => handleDelete(employee._id)}
                      title="Delete Employee"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.infoRow}>
                  <strong className={styles.infoLabel}>Employee ID:</strong>{" "}
                  {employee.ID}
                </p>
                <p className={styles.infoRow}>
                  <strong className={styles.infoLabel}>Position:</strong>{" "}
                  {employee.position}
                </p>
                <p className={styles.infoRow}>
                  <strong className={styles.infoLabel}>Department:</strong>{" "}
                  {employee.department}
                </p>
                <p className={styles.infoRow}>
                  <strong className={styles.infoLabel}>Phone:</strong>{" "}
                  {employee.phone}
                </p>
                <p className={styles.infoRow}>
                  <strong className={styles.infoLabel}>Joined:</strong>{" "}
                  {employee.dateOfJoining
                    ? new Date(employee.dateOfJoining).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className={styles.infoRow}>
                  <strong className={styles.infoLabel}>Email:</strong>{" "}
                  {employee.email}
                </p>
                <p className={styles.infoRow}>
                  <strong className={styles.infoLabel}>Status:</strong>{" "}
                  <select
                    value={
                      employee.availability === "1" ||
                      employee.availability === 1
                        ? "active"
                        : "inactive"
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        employee._id,
                        employee.availability === "1" ||
                          employee.availability === 1
                          ? "active"
                          : "inactive",
                        e.target.value
                      )
                    }
                    className={`${styles.statusSelect} ${
                      employee.availability === "1" ||
                      employee.availability === 1
                        ? styles.statusSelectActive
                        : styles.statusSelectInactive
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No employees found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
