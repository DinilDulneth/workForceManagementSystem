import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import UpdateIcon from "@mui/icons-material/Update";
import PersonIcon from "@mui/icons-material/Person";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import TitleIcon from "@mui/icons-material/Title"; // Added for title icon

function UpdateInquiry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState({
    employeeId: "",
    inquiry: "",
    title: "", // Added title field
    sender: "",
    department: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8070/api/inquiry/getInquiry/${id}`)
      .then((res) => {
        const {
          employeeId,
          inquiry: inquiryText,
          title, // Include title from API response
          sender,
          department,
        } = res.data;
        setInquiry({
          employeeId,
          inquiry: inquiryText,
          title: title || "", // Set title with fallback
          sender,
          department,
        });
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Error fetching inquiry: " + err.message,
          severity: "error",
        });
      });
  }, [id]);

  function updateInquiryData(e) {
    e.preventDefault();

    if (!inquiry.inquiry) {
      setSnackbar({
        open: true,
        message: "Please fill in the inquiry field",
        severity: "error",
      });
      return;
    }

    axios
      .put(`http://localhost:8070/api/inquiry/updateInquiry/${id}`, inquiry)
      .then(() => {
        setSnackbar({
          open: true,
          message: "Inquiry Updated Successfully! ✅",
          severity: "success",
        });
        setTimeout(() => navigate("/EmployeeDashboard/fetchInquiry"), 2000);
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Error updating inquiry: " + err.message,
          severity: "error",
        });
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setInquiry((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          {" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
              gap: 2,
            }}
          >
            <UpdateIcon sx={{ fontSize: 40, color: "#fc6625" }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #fc6625 30%, #e55a1c 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Update Inquiry
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={updateInquiryData}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <TextField
                fullWidth
                label="Employee ID"
                name="employeeId"
                value={inquiry.employeeId}
                disabled
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: "#fc6625" }} />
                  ),
                }}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={inquiry.title}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <TitleIcon sx={{ mr: 1, color: "#fc6625" }} />
                  ),
                }}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <TextField
                fullWidth
                label="Inquiry"
                name="inquiry"
                value={inquiry.inquiry}
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

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                endIcon={<UpdateIcon />}
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
                Update Inquiry
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

export default UpdateInquiry;
