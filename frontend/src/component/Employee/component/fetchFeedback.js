import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Container,
  Alert,
  Snackbar,
  Chip,
  LinearProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import MessageIcon from "@mui/icons-material/Message";

function FetchFeedback() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    getFeedbacks();
  }, []);

  function getFeedbacks() {
    setLoading(true);
    const localEmployeeId = localStorage.getItem("ID");

    if (!localEmployeeId) {
      setSnackbar({
        open: true,
        message: "Please log in to view feedback",
        severity: "error",
      });
      setTimeout(() => navigate("/UserLogin"), 2000);
      return;
    }

    // First validate employee exists in database and get correct ID
    axios
      .get(`http://localhost:8070/employee/getEmpByID/${localEmployeeId}`)
      .then((employeeResponse) => {
        const employeeData = employeeResponse.data;
        console.log("Employee validated:", employeeData);

        // Get the correct ID from database
        const dbEmployeeId = employeeData.ID || localEmployeeId;

        // Fetch feedback with the validated ID
        return axios.get(
          `http://localhost:8070/api/feedback/getFeedbackByEmployeeId/${dbEmployeeId}`
        );
      })
      .then((res) => {
        const formattedFeedbacks = res.data.map((feedback) => ({
          ...feedback,
          date: new Date(feedback.date),
        }));
        setFeedbacks(formattedFeedbacks);
      })
      .catch((err) => {
        console.error("Error in validation or fetching feedback:", err);

        // Fallback to using localStorage ID if validation fails
        axios
          .get(
            `http://localhost:8070/api/feedback/getFeedbackByEmployeeId/${localEmployeeId}`
          )
          .then((res) => {
            const formattedFeedbacks = res.data.map((feedback) => ({
              ...feedback,
              date: new Date(feedback.date),
            }));
            setFeedbacks(formattedFeedbacks);
          })
          .catch((fbErr) => {
            setSnackbar({
              open: true,
              message: "Error fetching feedback: " + fbErr.message,
              severity: "error",
            });
            console.error(fbErr);
          });

        setSnackbar({
          open: true,
          message: "Using local ID for feedback. Some feedback may not appear.",
          severity: "warning",
        });
      })
      .finally(() => setLoading(false));
  }

  function deleteFeedback(id) {
    axios
      .delete(`http://localhost:8070/api/feedback/deleteFeedback/${id}`)
      .then(() => {
        setSnackbar({
          open: true,
          message: "Feedback deleted successfully",
          severity: "success",
        });
        setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Error deleting feedback: " + err.message,
          severity: "error",
        });
        console.error(err);
      });
  }

  function formatDate(date) {
    if (!date) return "";
    try {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <br></br>
        <br></br>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
            gap: 2,
          }}
        >
          <MessageIcon sx={{ fontSize: 40, color: "#fc6625" }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #fc6625 30%, #e55a1c 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Feedback Dashboard
          </Typography>
        </Box>

        {loading && (
          <LinearProgress
            sx={{
              mb: 3,
              backgroundColor: "rgba(252, 102, 37, 0.1)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#fc6625",
              },
            }}
          />
        )}

        <AnimatePresence>
          {feedbacks.map((feedback, index) => (
            <motion.div
              key={feedback._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  mb: 2,
                  p: 3,
                  borderRadius: 2,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(252, 102, 37, 0.1)",
                  border: "1px solid rgba(252, 102, 37, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(252, 102, 37, 0.2)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#fc6625",
                        fontWeight: 700,
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        borderBottom: "2px solid rgba(252, 102, 37, 0.2)",
                        paddingBottom: 1,
                      }}
                    >
                      {feedback.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "#474747",
                        mb: 2,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        fontSize: "1.05rem",
                      }}
                    >
                      <MessageIcon sx={{ color: "#8f9491", mt: 0.5 }} />
                      {feedback.feedback}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                      <Chip
                        icon={<PersonIcon />}
                        label={`From: ${feedback.sender}`}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(252, 102, 37, 0.1)",
                          color: "#fc6625",
                          "& .MuiChip-icon": {
                            color: "#fc6625",
                          },
                        }}
                      />
                      <Chip
                        icon={<DateRangeIcon />}
                        label={formatDate(feedback.date)}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(229, 90, 28, 0.1)",
                          color: "#e55a1c",
                          "& .MuiChip-icon": {
                            color: "#e55a1c",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
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

export default FetchFeedback;
