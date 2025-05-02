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
  Snackbar,
  Alert,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import FeedbackIcon from "@mui/icons-material/Feedback";
import MessageIcon from "@mui/icons-material/Message";
import TitleIcon from "@mui/icons-material/Title";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function AddFeedback() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: "",
    title: "",
    feedback: "",
    sender: "",
    date: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const managerId = localStorage.getItem("ID");

    setFormData((prev) => ({
      ...prev,
      date: new Date().toISOString(),
      sender: managerId || "",
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function sendFeedbackData(e) {
    e.preventDefault();

    if (!formData.employeeId || !formData.feedback || !formData.title) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }

    axios
      .post("http://localhost:8070/api/feedback/addFeedback", formData)
      .then((response) => {
        if (response.status === 201) {
          setSnackbar({
            open: true,
            message: "Feedback Added Successfully! ✅",
            severity: "success",
          });
          setFormData({
            employeeId: "",
            title: "",
            feedback: "",
            sender: localStorage.getItem("ID") || "",
            date: new Date().toISOString(),
          });
          setTimeout(() => navigate("/HRDashboard/fetchFeedback"), 2000);
        }
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Error adding Feedback: " + err.message,
          severity: "error",
        });
      });
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <br />
        <br />
        <br />
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 2,
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(252, 102, 37, 0.1)",
            border: "1px solid rgba(252, 102, 37, 0.1)",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
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
              <FeedbackIcon sx={{ fontSize: 40, color: "#fc6625" }} />
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(45deg, #fc6625 30%, #e55a1c 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Submit Feedback
              </Typography>
            </Box>
          </motion.div>

          <Box
            component="form"
            onSubmit={sendFeedbackData}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <TextField
                fullWidth
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: "#fc6625" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#fc6625",
                    },
                  },
                  "& label.Mui-focused": {
                    color: "#fc6625",
                  },
                }}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <TextField
                fullWidth
                label="Feedback Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <TitleIcon sx={{ mr: 1, color: "#fc6625" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#fc6625",
                    },
                  },
                  "& label.Mui-focused": {
                    color: "#fc6625",
                  },
                }}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <TextField
                fullWidth
                label="Feedback Message"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                required
                multiline
                rows={4}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <MessageIcon sx={{ mr: 1, mt: 1, color: "#fc6625" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#fc6625",
                    },
                  },
                  "& label.Mui-focused": {
                    color: "#fc6625",
                  },
                }}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                endIcon={<SendIcon />}
                sx={{
                  mt: 2,
                  height: 56,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background:
                    "linear-gradient(45deg, #fc6625 30%, #e55a1c 90%)",
                  boxShadow: "0 3px 15px rgba(252, 102, 37, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #e55a1c 30%, #fc6625 90%)",
                    boxShadow: "0 5px 20px rgba(252, 102, 37, 0.4)",
                  },
                }}
              >
                Submit Feedback
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Button
                variant="contained"
                fullWidth
                size="large"
                endIcon={<VisibilityIcon />}
                onClick={() => navigate("/HRDashboard/fetchFeedback")}
                sx={{
                  height: 56,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background: `linear-gradient(45deg, #fc6625 30%, #e55a1c 90%)`,
                  boxShadow: "0 3px 15px rgba(252, 102, 37, 0.3)",
                  "&:hover": {
                    background: `linear-gradient(45deg, #e55a1c 30%, #fc6625 90%)`,
                    boxShadow: "0 5px 20px rgba(252, 102, 37, 0.4)",
                  },
                }}
              >
                View Feedbacks
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>

      <AnimatePresence>
        {snackbar.open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
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
                    background: "#2ecc71",
                  }),
                  ...(snackbar.severity === "error" && {
                    background: "#e55a1c",
                  }),
                }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
