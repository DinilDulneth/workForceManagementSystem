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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import MessageIcon from "@mui/icons-material/Message";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import DeleteIcon from "@mui/icons-material/Delete";
import SortIcon from "@mui/icons-material/Sort";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

function FetchFeedback() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  useEffect(() => {
    getFeedbacks();
  }, []);

  const handleFilterChange = (event, newFilterMode) => {
    if (newFilterMode !== null) {
      setFilterMode(newFilterMode);
    }
  };

  const handleSortChange = (event, newSortOrder) => {
    if (newSortOrder !== null) {
      setSortOrder(newSortOrder);
    }
  };

  const filteredFeedbacks = feedbacks
    .filter((feedback) => {
      if (filterMode === "all") return true;
      if (filterMode === "viewed") return feedback.viewed;
      if (filterMode === "unviewed") return !feedback.viewed;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date) - new Date(a.date);
      } else {
        return new Date(a.date) - new Date(b.date);
      }
    });

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

    axios
      .get(`http://localhost:8070/employee/getEmpByID/${localEmployeeId}`)
      .then((employeeResponse) => {
        const employeeData = employeeResponse.data;
        const dbEmployeeId = employeeData.ID || localEmployeeId;

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

  function markAsViewed(id) {
    axios
      .put(`http://localhost:8070/api/feedback/markAsViewed/${id}`)
      .then((res) => {
        setSnackbar({
          open: true,
          message: "Feedback marked as viewed",
          severity: "success",
        });

        setFeedbacks(
          feedbacks.map((feedback) =>
            feedback._id === id ? { ...feedback, viewed: true } : feedback
          )
        );
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Error marking feedback as viewed: " + err.message,
          severity: "error",
        });
        console.error(err);
      });
  }

  function handleDeleteClick(id) {
    setConfirmDelete({ open: true, id });
  }

  function handleConfirmDelete() {
    if (confirmDelete.id) {
      deleteFeedback(confirmDelete.id);
      setConfirmDelete({ open: false, id: null });
    }
  }

  function handleCancelDelete() {
    setConfirmDelete({ open: false, id: null });
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

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            gap: 2,
            mb: 3,
            backgroundColor: "rgba(252, 102, 37, 0.05)",
            borderRadius: 2,
            padding: 2,
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, textAlign: "center", color: "#666" }}
            >
              Filter by Status
            </Typography>
            <ToggleButtonGroup
              value={filterMode}
              exclusive
              onChange={handleFilterChange}
              aria-label="feedback filter"
              size="small"
              sx={{
                "& .MuiToggleButton-root.Mui-selected": {
                  backgroundColor: "rgba(252, 102, 37, 0.2)",
                  color: "#fc6625",
                  "&:hover": {
                    backgroundColor: "rgba(252, 102, 37, 0.3)",
                  },
                },
              }}
            >
              <ToggleButton value="all" aria-label="all feedback">
                <AllInboxIcon sx={{ mr: 1 }} />
                All
              </ToggleButton>
              <ToggleButton value="unviewed" aria-label="unviewed feedback">
                <VisibilityOffIcon sx={{ mr: 1 }} />
                Unviewed
              </ToggleButton>
              <ToggleButton value="viewed" aria-label="viewed feedback">
                <VisibilityIcon sx={{ mr: 1 }} />
                Viewed
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, textAlign: "center", color: "#666" }}
            >
              Sort by Date
            </Typography>
            <ToggleButtonGroup
              value={sortOrder}
              exclusive
              onChange={handleSortChange}
              aria-label="feedback sort"
              size="small"
              sx={{
                "& .MuiToggleButton-root.Mui-selected": {
                  backgroundColor: "rgba(252, 102, 37, 0.2)",
                  color: "#fc6625",
                  "&:hover": {
                    backgroundColor: "rgba(252, 102, 37, 0.3)",
                  },
                },
              }}
            >
              <ToggleButton value="newest" aria-label="newest first">
                <ArrowDownwardIcon sx={{ mr: 1, fontSize: "1rem" }} />
                Newest First
              </ToggleButton>
              <ToggleButton value="oldest" aria-label="oldest first">
                <ArrowUpwardIcon sx={{ mr: 1, fontSize: "1rem" }} />
                Oldest First
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
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

        {!loading && filteredFeedbacks.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              my: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "rgba(252, 102, 37, 0.05)",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No {filterMode === "all" ? "" : filterMode} feedback found
            </Typography>
          </Box>
        )}

        <AnimatePresence>
          {filteredFeedbacks.map((feedback, index) => (
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
                  opacity: feedback.viewed ? 0.8 : 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ width: "90%" }}>
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
                      {feedback.viewed && (
                        <Chip
                          size="small"
                          label="Viewed"
                          icon={<VisibilityIcon fontSize="small" />}
                          sx={{
                            ml: 2,
                            backgroundColor: "rgba(76, 175, 80, 0.1)",
                            color: "#4caf50",
                            "& .MuiChip-icon": {
                              color: "#4caf50",
                            },
                          }}
                        />
                      )}
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

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: 3,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
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
                      {!feedback.viewed && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => markAsViewed(feedback._id)}
                          sx={{
                            borderColor: "#4caf50",
                            color: "#4caf50",
                            ml: "auto",
                            "&:hover": {
                              backgroundColor: "rgba(76, 175, 80, 0.1)",
                              borderColor: "#4caf50",
                            },
                          }}
                        >
                          Mark as Viewed
                        </Button>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteClick(feedback._id)}
                      sx={{
                        color: "#e55a1c",
                        "&:hover": {
                          backgroundColor: "rgba(229, 90, 28, 0.1)",
                          color: "#fc6625",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Dialog
        open={confirmDelete.open}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this feedback? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              backgroundColor: "#fc6625",
              color: "white",
              "&:hover": {
                backgroundColor: "#e55a1c",
              },
            }}
          >
            Delete
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
