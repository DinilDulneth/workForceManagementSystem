import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Test() {
  // State for leave form fields
  const [formData, setFormData] = useState({
    id: "",
    department: "",
    leavetype: "",
    date: "",
    medicalCertificate: ""
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validate image file
  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Please upload only JPG, PNG, or GIF images",
        confirmButtonColor: "#3085d6"
      });
      return false;
    }

    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "File size should not exceed 2MB",
        confirmButtonColor: "#3085d6"
      });
      return false;
    }

    return true;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      Swal.fire({
        icon: "info",
        title: "File Selected",
        text: `Selected file: ${selectedFile.name}`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const { id, department, leavetype, date } = formData;
    if (!id || !department || !leavetype || !date) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields (ID, Department, Leave Type, Date)",
        confirmButtonColor: "#3085d6"
      });
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("id", id);
    data.append("department", department);
    data.append("leavetype", leavetype);
    data.append("date", date);
    data.append("medicalCertificate", formData.medicalCertificate);
    if (file) {
      data.append("image", file); // Must match backend upload.single('image')
    }

    try {
      const loadingSwal = Swal.fire({
        title: "Submitting...",
        html: `
          <div class="progress" style="height: 20px;">
            <div class="progress-bar" role="progressbar" style="width: 0%"></div>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await axios.post(
        "http://localhost:8070/leave/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            const progressBar =
              Swal.getHtmlContainer().querySelector(".progress-bar");
            if (progressBar) {
              progressBar.style.width = `${percentCompleted}%`;
              progressBar.textContent = `${percentCompleted}%`;
            }
          },
          timeout: 30000
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Leave Request Submitted!",
        text: response.data.message,
        timer: 2000,
        showConfirmButton: false
      });

      // Reset form
      setFormData({
        id: "",
        department: "",
        leavetype: "",
        date: "",
        medicalCertificate: ""
      });
      setFile(null);
    } catch (error) {
      console.error("Submission failed:", error);
      let errorMessage =
        "Something went wrong while submitting the leave request";

      if (error.response) {
        errorMessage =
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage =
          "Could not reach the server. Please check your connection.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Submission timed out. Please try again.";
      }

      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: errorMessage,
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Try Again",
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          handleSubmit(e);
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container p-4">
      <h2 className="mb-4">Leave Request Form</h2>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div className="form-group">
          <label>Employee ID</label>
          <input
            type="number"
            className="form-control"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            className="form-control"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Leave Type</label>
          <select
            className="form-control"
            name="leavetype"
            value={formData.leavetype}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Leave Type</option>
            <option value="Annual">Annual</option>
            <option value="Sick">Sick</option>
            <option value="Maternity">Maternity</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Medical Certificate (if applicable)</label>
          <input
            type="text"
            className="form-control"
            name="medicalCertificate"
            value={formData.medicalCertificate}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Upload Image (optional)</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            accept="image/*"
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span>
              <i className="fas fa-spinner fa-spin me-2"></i>
              Submitting...
            </span>
          ) : (
            "Submit Leave Request"
          )}
        </button>
      </form>
    </div>
  );
}
// Add any additional CSS styles as needed
