import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Container,
  Alert,
  Snackbar,
  Chip,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import MessageIcon from "@mui/icons-material/Message";
import TitleIcon from "@mui/icons-material/Title";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

function FetchFeedback() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest"); // Add sort order state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editDialog, setEditDialog] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState({
    _id: "",
    title: "",
    feedback: "",
    employeeId: "",
    sender: "",
  });

  useEffect(() => {
    getFeedbacks();
  }, []);

  function getFeedbacks() {
    setLoading(true);
    const localHrId = localStorage.getItem("ID");

    if (!localHrId) {
      setSnackbar({
        open: true,
        message: "Please log in to view feedback",
        severity: "error",
      });
      setTimeout(() => navigate("/HRLogin"), 2000);
      return;
    }

    // First fetch HR data from MongoDB to get correct ID
    axios
      .get(`http://localhost:8070/hr/getHRByID/${localHrId}`)
      .then((hrResponse) => {
        const hrData = hrResponse.data;
        console.log("HR data from DB:", hrData);

        // Get the correct ID from database
        const dbHrId = hrData.ID || localHrId;

        // Fetch feedback using the database ID
        return axios.get(
          `http://localhost:8070/api/feedback/getFeedbackBySender/${dbHrId}`
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
            `http://localhost:8070/api/feedback/getFeedbackBySender/${localHrId}`
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
          message: "Using local ID for feedback. Some data may not appear.",
          severity: "warning",
        });
      })
      .finally(() => setLoading(false));
  }

  function deleteFeedback(id) {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
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
  }

  function handleUpdate() {
    axios
      .put(
        `http://localhost:8070/api/feedback/updateFeedback/${editingFeedback._id}`,
        {
          title: editingFeedback.title,
          feedback: editingFeedback.feedback,
          employeeId: editingFeedback.employeeId,
          sender: editingFeedback.sender,
        }
      )
      .then((response) => {
        setSnackbar({
          open: true,
          message: "Feedback updated successfully!",
          severity: "success",
        });
        getFeedbacks(); // Refresh the list
        setEditDialog(false);
      })
      .catch((error) => {
        console.error("Error updating feedback:", error);
        setSnackbar({
          open: true,
          message: "Error updating feedback: " + error.message,
          severity: "error",
        });
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

  // Function to sort feedbacks by date
  const sortFeedbacks = (feedbacksToSort) => {
    return [...feedbacksToSort].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  };

  // Toggle sort order function
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  // Get sorted feedbacks
  const sortedFeedbacks = sortFeedbacks(feedbacks);

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

        {/* Add sort button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={
              sortOrder === "newest" ? (
                <ArrowDownwardIcon />
              ) : (
                <ArrowUpwardIcon />
              )
            }
            onClick={toggleSortOrder}
            sx={{
              color: "#fc6625",
              borderColor: "#fc6625",
              "&:hover": {
                borderColor: "#e55a1c",
                backgroundColor: "rgba(252, 102, 37, 0.1)",
              },
            }}
          >
            {sortOrder === "newest" ? "Newest First" : "Oldest First"}
          </Button>
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
          {sortedFeedbacks.map((feedback, index) => (
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
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#474747",
                        fontWeight: 600,
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <PersonIcon sx={{ color: "#fc6625" }} />
                      Employee ID: {feedback.employeeId}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#474747",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontWeight: 500,
                      }}
                    >
                      <TitleIcon sx={{ color: "#fc6625" }} />
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
                      }}
                    >
                      <MessageIcon sx={{ color: "#8f9491", mt: 0.5 }} />
                      {feedback.feedback}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Chip
                        icon={<PersonIcon />}
                        label={`Sender: ${feedback.sender}`}
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

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            setEditingFeedback({
                              _id: feedback._id,
                              title: feedback.title,
                              feedback: feedback.feedback,
                              employeeId: feedback.employeeId,
                              sender: feedback.sender,
                            });
                            setEditDialog(true);
                          }}
                          sx={{
                            color: "#fc6625",
                            borderColor: "#fc6625",
                            "&:hover": {
                              borderColor: "#e55a1c",
                              backgroundColor: "rgba(252, 102, 37, 0.1)",
                            },
                          }}
                        >
                          Update
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() => deleteFeedback(feedback._id)}
                          sx={{
                            color: "#e55a1c",
                            borderColor: "#e55a1c",
                            "&:hover": {
                              borderColor: "#fc6625",
                              backgroundColor: "rgba(229, 90, 28, 0.1)",
                            },
                          }}
                        >
                          Delete
                        </Button>
                      </motion.div>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "#fc6625", fontWeight: 600 }}>
          Edit Feedback
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editingFeedback.title}
            onChange={(e) =>
              setEditingFeedback({
                ...editingFeedback,
                title: e.target.value,
              })
            }
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Feedback"
            value={editingFeedback.feedback}
            onChange={(e) =>
              setEditingFeedback({
                ...editingFeedback,
                feedback: e.target.value,
              })
            }
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Employee ID"
            value={editingFeedback.employeeId}
            onChange={(e) =>
              setEditingFeedback({
                ...editingFeedback,
                employeeId: e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Sender"
            value={editingFeedback.sender}
            onChange={(e) =>
              setEditingFeedback({
                ...editingFeedback,
                sender: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialog(false)}
            sx={{ color: "#8f9491" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            sx={{
              backgroundColor: "#fc6625",
              color: "white",
              "&:hover": {
                backgroundColor: "#e55a1c",
              },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

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
