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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BusinessIcon from "@mui/icons-material/Business";
import MessageIcon from "@mui/icons-material/Message";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SortIcon from "@mui/icons-material/Sort";
import ClearIcon from "@mui/icons-material/Clear";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

function FetchInquiry() {
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest"); // Track sort order: "newest" or "oldest"
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editDialog, setEditDialog] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState({
    _id: "",
    inquiry: "",
    title: "", // Add title field
    department: "",
    employeeId: "",
  });
  const [selectedDate, setSelectedDate] = useState(null); // State for date filter
  const [selectedDepartment, setSelectedDepartment] = useState(""); // State for department filter
  const [completionStatus, setCompletionStatus] = useState("all"); // all, completed, pending

  useEffect(() => {
    getInquiry();
  }, []);

  function getInquiry() {
    setLoading(true);
    const localEmployeeId = localStorage.getItem("ID");

    if (!localEmployeeId) {
      setSnackbar({
        open: true,
        message: "Please log in to view inquiries",
        severity: "error",
      });
      setTimeout(() => navigate("/UserLogin"), 2000);
      return;
    }

    // First fetch employee data from MongoDB
    axios
      .get(`http://localhost:8070/employee/getEmpByID/${localEmployeeId}`)
      .then((employeeResponse) => {
        const employeeData = employeeResponse.data;
        console.log("Employee data from DB:", employeeData);

        // Always use the MongoDB IDs
        const dbEmployeeId = employeeData.ID;

        if (!dbEmployeeId) {
          throw new Error("Invalid employee ID from database");
        }

        // Then fetch inquiries
        return axios
          .get("http://localhost:8070/api/inquiry/getInquiry")
          .then((inquiryRes) => {
            // Filter inquiries using ONLY the database employee ID
            const filteredInquiries = inquiryRes.data.filter(
              (inq) => inq.employeeId === dbEmployeeId
            );

            setInquiry(filteredInquiries);
          });
      })
      .catch((err) => {
        console.error("Error in getInquiry:", err);

        setSnackbar({
          open: true,
          message: "Error fetching data from MongoDB. Please login again.",
          severity: "error",
        });

        // Don't fall back to localStorage IDs - redirect to login
        setTimeout(() => navigate("/UserLogin"), 2000);
      })
      .finally(() => setLoading(false));
  }

  // Function to sort inquiries by date
  const sortInquiries = (inquiries) => {
    return [...inquiries].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  };

  // Function to filter inquiries by selected date
  const filterInquiriesByDate = (inquiries) => {
    if (!selectedDate) return inquiries;
    return inquiries.filter((inq) => {
      const inquiryDate = new Date(inq.date).toDateString();
      const filterDate = new Date(selectedDate).toDateString();
      return inquiryDate === filterDate;
    });
  };

  // Function to filter inquiries by selected department
  const filterInquiriesByDepartment = (inquiries) => {
    if (!selectedDepartment) return inquiries;
    return inquiries.filter((inq) => inq.department === selectedDepartment);
  };

  // Function to filter inquiries by completion status
  const filterInquiriesByCompletion = (inquiries) => {
    if (completionStatus === "all") return inquiries;
    return inquiries.filter((inq) =>
      completionStatus === "completed" ? inq.completed : !inq.completed
    );
  };

  // Handler for sort order change
  const handleSortChange = (event, newSortOrder) => {
    if (newSortOrder !== null) {
      setSortOrder(newSortOrder);
    }
  };

  // Handle department filter change - update to handle Select change
  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  // Function to toggle inquiry completion status
  function toggleInquiryCompletion(id, currentStatus) {
    const newStatus = !currentStatus;

    axios
      .put(`http://localhost:8070/api/inquiry/updateStatus/${id}`, {
        completed: newStatus,
      })
      .then((res) => {
        // Update local state
        setInquiry(
          inquiry.map((inq) =>
            inq._id === id ? { ...inq, completed: newStatus } : inq
          )
        );

        setSnackbar({
          open: true,
          message: `Inquiry marked as ${newStatus ? "completed" : "pending"}`,
          severity: "success",
        });
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Error updating inquiry status: " + err.message,
          severity: "error",
        });
      });
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      axios
        .delete(`http://localhost:8070/api/inquiry/deleteInquiry/${id}`)
        .then(() => {
          setSnackbar({
            open: true,
            message: "Inquiry deleted successfully!",
            severity: "success",
          });
          getInquiry(); // Refresh the list
        })
        .catch((error) => {
          console.error("Error deleting inquiry:", error);
          setSnackbar({
            open: true,
            message: "Error deleting inquiry: " + error.message,
            severity: "error",
          });
        });
    }
  }

  function handleUpdate() {
    axios
      .put(
        `http://localhost:8070/api/inquiry/updateInquiry/${editingInquiry._id}`,
        {
          inquiry: editingInquiry.inquiry,
          title: editingInquiry.title, // Include title in update
          department: editingInquiry.department,
          employeeId: editingInquiry.employeeId,
        }
      )
      .then((response) => {
        setSnackbar({
          open: true,
          message: "Inquiry updated successfully!",
          severity: "success",
        });
        getInquiry(); // Refresh the list
        setEditDialog(false);
      })
      .catch((error) => {
        console.error("Error updating inquiry:", error);
        setSnackbar({
          open: true,
          message: "Error updating inquiry: " + error.message,
          severity: "error",
        });
      });
  }

  // Get sorted and filtered inquiries
  const sortedInquiries = sortInquiries(inquiry);
  const dateFilteredInquiries = filterInquiriesByDate(sortedInquiries);
  const departmentFilteredInquiries = filterInquiriesByDepartment(
    dateFilteredInquiries
  );
  const filteredInquiries = filterInquiriesByCompletion(
    departmentFilteredInquiries
  );

  // Get unique departments for the filter dropdown and make sure HR is included
  const uniqueDepartments = [
    ...new Set([...inquiry.map((inq) => inq.department), "HR"]),
  ].filter(Boolean);

  // Check if any inquiries will be shown with current filters
  const hasFilteredResults = filteredInquiries.length > 0;

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
            My Inquiries
          </Typography>
        </Box>

        {/* Modernized filter controls */}
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
          {/* Sort controls */}
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
              aria-label="inquiry sort"
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

          {/* Department filter - convert to dropdown */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, textAlign: "center", color: "#666" }}
            >
              Filter by Department
            </Typography>
            <FormControl
              fullWidth
              size="small"
              sx={{
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(252, 102, 37, 0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#fc6625",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fc6625",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#fc6625",
                },
                "& .MuiSelect-icon": {
                  color: "#fc6625",
                },
              }}
            >
              <InputLabel id="department-filter-label">Department</InputLabel>
              <Select
                labelId="department-filter-label"
                id="department-filter"
                value={selectedDepartment}
                label="Department"
                onChange={handleDepartmentChange}
                startAdornment={
                  selectedDepartment ? (
                    <BusinessIcon
                      sx={{
                        mr: 1,
                        ml: -0.5,
                        color: "#fc6625",
                        fontSize: "1.2rem",
                      }}
                    />
                  ) : null
                }
              >
                <MenuItem value="">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FilterAltIcon
                      sx={{ mr: 1, fontSize: "1.2rem", color: "#fc6625" }}
                    />
                    All Departments
                  </Box>
                </MenuItem>
                {uniqueDepartments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BusinessIcon
                        sx={{ mr: 1, fontSize: "1.2rem", color: "#fc6625" }}
                      />
                      {dept}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Date filter */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, textAlign: "center", color: "#666" }}
            >
              Filter by Date
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(252, 102, 37, 0.5)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#fc6625",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#fc6625",
                          },
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              {selectedDate && (
                <IconButton
                  onClick={() => setSelectedDate(null)}
                  sx={{
                    color: "#e55a1c",
                    ml: 1,
                    "&:hover": {
                      backgroundColor: "rgba(229, 90, 28, 0.1)",
                    },
                  }}
                >
                  <ClearIcon />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Add Completion Status Filter */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, textAlign: "center", color: "#666" }}
            >
              Status
            </Typography>
            <FormControl
              fullWidth
              size="small"
              sx={{
                minWidth: 150,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(252, 102, 37, 0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#fc6625",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fc6625",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#fc6625",
                },
                "& .MuiSelect-icon": {
                  color: "#fc6625",
                },
              }}
            >
              <InputLabel id="completion-status-label">Status</InputLabel>
              <Select
                labelId="completion-status-label"
                id="completion-status"
                value={completionStatus}
                label="Status"
                onChange={(e) => setCompletionStatus(e.target.value)}
              >
                <MenuItem value="all">All Inquiries</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
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

        {!loading && filteredInquiries.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              border: "1px dashed rgba(252, 102, 37, 0.3)",
              borderRadius: 2,
              backgroundColor: "rgba(252, 102, 37, 0.05)",
            }}
          >
            <Typography variant="h6" sx={{ color: "#fc6625", mb: 1 }}>
              No inquiries found
            </Typography>
            <Typography variant="body1" sx={{ color: "#8f9491" }}>
              {selectedDepartment
                ? `There are no inquiries for the "${selectedDepartment}" department. Try creating one or selecting a different department.`
                : "No inquiries match your current filters. Try adjusting your filters or creating new inquiries."}
            </Typography>
          </Box>
        )}

        <AnimatePresence>
          {filteredInquiries.map((inq, index) => (
            <motion.div
              key={inq._id}
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
                  background: inq.completed
                    ? "rgba(245, 252, 245, 0.95)"
                    : "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  boxShadow: inq.completed
                    ? "0 8px 32px rgba(80, 180, 80, 0.15)"
                    : "0 8px 32px rgba(252, 102, 37, 0.1)",
                  border: inq.completed
                    ? "1px solid rgba(80, 180, 80, 0.2)"
                    : "1px solid rgba(252, 102, 37, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: inq.completed
                      ? "0 12px 40px rgba(80, 180, 80, 0.25)"
                      : "0 12px 40px rgba(252, 102, 37, 0.2)",
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
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#fc6625",
                        fontWeight: 700,
                        mb: 2,
                        borderBottom: "2px solid rgba(252, 102, 37, 0.1)",
                        paddingBottom: 1.5,
                      }}
                    >
                      {inq.title || "Untitled Inquiry"}
                    </Typography>

                    {/* Display inquiry message */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#474747",
                        mb: 3,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        fontSize: "1.05rem",
                      }}
                    >
                      <MessageIcon sx={{ color: "#8f9491", mt: 0.5 }} />
                      {inq.inquiry}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Chip
                        icon={<BusinessIcon />}
                        label={`Department: ${inq.department}`}
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
                        label={new Date(inq.date).toLocaleDateString()}
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
                            setEditingInquiry({
                              _id: inq._id,
                              inquiry: inq.inquiry,
                              title: inq.title || "", // Include title in editing
                              department: inq.department,
                              employeeId: inq.employeeId,
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
                          onClick={() => handleDelete(inq._id)}
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

                      {/* Add Toggle Completion Button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={inq.completed ? "outlined" : "contained"}
                          onClick={() =>
                            toggleInquiryCompletion(inq._id, inq.completed)
                          }
                          sx={{
                            color: inq.completed ? "#2e7d32" : "white",
                            backgroundColor: inq.completed
                              ? "transparent"
                              : "#2e7d32",
                            borderColor: "#2e7d32",
                            "&:hover": {
                              backgroundColor: inq.completed
                                ? "rgba(46, 125, 50, 0.1)"
                                : "#256f29",
                              borderColor: "#2e7d32",
                            },
                          }}
                        >
                          {inq.completed
                            ? "Mark as Pending"
                            : "Mark as Completed"}
                        </Button>
                      </motion.div>
                    </Box>

                    {/* Show completion status chip if completed */}
                    {inq.completed && (
                      <Box mt={2}>
                        <Chip
                          label="Completed"
                          color="success"
                          size="small"
                          sx={{
                            backgroundColor: "rgba(46, 125, 50, 0.1)",
                            color: "#2e7d32",
                          }}
                        />
                      </Box>
                    )}
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
          Edit Inquiry
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editingInquiry.title || ""}
            onChange={(e) =>
              setEditingInquiry({
                ...editingInquiry,
                title: e.target.value,
              })
            }
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Inquiry"
            value={editingInquiry.inquiry}
            onChange={(e) =>
              setEditingInquiry({
                ...editingInquiry,
                inquiry: e.target.value,
              })
            }
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Department"
            value={editingInquiry.department}
            onChange={(e) =>
              setEditingInquiry({
                ...editingInquiry,
                department: e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Employee ID"
            value={editingInquiry.employeeId}
            onChange={(e) =>
              setEditingInquiry({
                ...editingInquiry,
                employeeId: e.target.value,
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

export default FetchInquiry;
