import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import HistoryIcon from "@mui/icons-material/History"; // Added HistoryIcon

export default function AddInquiry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    inquiry: "",
    employeeId: "",
    sender: "",
    date: "",
    department: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    // Get employee ID from the existing localStorage
    const employeeId = localStorage.getItem("ID");
    const employeeName = localStorage.getItem("Name");

    if (!employeeId) {
      setSnackbar({
        open: true,
        message: "Please log in to submit an inquiry",
        severity: "error",
      });
      setTimeout(() => navigate("/UserLogin"), 2000);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      date: new Date().toISOString(),
      employeeId: employeeId,
      sender: employeeName || employeeId,
    }));
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleViewPastInquiries = () => {
    navigate("/EmployeeDashboard/fetchInquiry");
  };

  function sendInquiryData(e) {
    e.preventDefault();

    if (!formData.inquiry || !formData.department) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }

    axios
      .post("http://localhost:8070/api/inquiry/addInquiry", formData)
      .then(() => {
        setSnackbar({
          open: true,
          message: "Inquiry Added Successfully! ✅",
          severity: "success",
        });
        setTimeout(() => navigate("/EmployeeDashboard/fetchInquiry"), 2000);
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Error adding Inquiry: " + err.message,
          severity: "error",
        });
      });
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <br></br>
        <br></br>
        <br></br>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(252, 102, 37, 0.1)",
            border: "1px solid rgba(252, 102, 37, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
              gap: 2,
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: 40, color: "#fc6625" }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #fc6625 30%, #e55a1c 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Submit Inquiry
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={sendInquiryData}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Existing form fields remain unchanged */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <TextField
                fullWidth
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                disabled
                InputProps={{
                  startAdornment: (
                    <BadgeIcon sx={{ mr: 1, color: "#fc6625" }} />
                  ),
                }}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <TextField
                fullWidth
                label="Inquiry"
                name="inquiry"
                value={formData.inquiry}
                onChange={handleChange}
                required
                multiline
                rows={4}
                InputProps={{
                  startAdornment: (
                    <HelpOutlineIcon sx={{ mr: 1, mt: 1, color: "#fc6625" }} />
                  ),
                }}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  startAdornment={
                    <BusinessIcon sx={{ mr: 1, color: "#fc6625" }} />
                  }
                >
                  <MenuItem value="">Select Department</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="General Manager">General Manager</MenuItem>
                </Select>
              </FormControl>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                endIcon={<SendIcon />}
                sx={{
                  mt: 2,
                  height: 48,
                  background:
                    "linear-gradient(45deg, #fc6625 30%, #e55a1c 90%)",
                  boxShadow: "0 3px 15px rgba(252, 102, 37, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #e55a1c 30%, #fc6625 90%)",
                  },
                }}
              >
                Submit Inquiry
              </Button>
            </motion.div>

            {/* Added View Past Inquiries Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                variant="contained"
                fullWidth
                size="large"
                endIcon={<HistoryIcon />}
                onClick={handleViewPastInquiries}
                sx={{
                  mt: 2,
                  height: 48,
                  background:
                    "linear-gradient(45deg,rgb(255, 98, 0) 30%,rgb(252, 127, 37) 90%)",
                  boxShadow: "0 3px 15px rgba(74, 108, 247, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg,rgb(252, 91, 37) 30%,rgb(247, 129, 74) 90%)",
                  },
                }}
              >
                View Past Inquiries
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            ...(snackbar.severity === "success" && {
              backgroundColor: "#fc6625",
            }),
            ...(snackbar.severity === "error" && {
              backgroundColor: "#e55a1c",
            }),
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
