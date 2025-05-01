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
  TextField,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BusinessIcon from "@mui/icons-material/Business";
import MessageIcon from "@mui/icons-material/Message";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ClearIcon from "@mui/icons-material/Clear";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

function FetchInquiry() {
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [managerDepartment, setManagerDepartment] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // Track sort order
  const [selectedDate, setSelectedDate] = useState(null); // State for date filter

  useEffect(() => {
    // Get manager department from localStorage
    const department = localStorage.getItem("Department") || "";
    setManagerDepartment(department);

    // Only get HR department inquiries
    getInquiry();
  }, []);

  function getInquiry() {
    setLoading(true);

    // Directly fetch only HR inquiries
    axios
      .get("http://localhost:8070/api/inquiry/getInquiryByDepartment/HR")
      .then((res) => {
        setInquiry(res.data);
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Error fetching inquiries: " + err.message,
          severity: "error",
        });
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

  // Toggle sort order function
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  // Get sorted and filtered inquiries
  const sortedInquiries = sortInquiries(inquiry);
  const filteredInquiries = filterInquiriesByDate(sortedInquiries);

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
            HR Department Inquiries
          </Typography>
        </Box>

        {/* Add sort and filter controls */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Filter by Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </LocalizationProvider>
            {selectedDate && (
              <IconButton
                onClick={() => setSelectedDate(null)}
                sx={{
                  color: "#e55a1c",
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
              No HR inquiries found
            </Typography>
            <Typography variant="body1" sx={{ color: "#8f9491" }}>
              {selectedDate
                ? "No HR inquiries found for the selected date. Try another date or clear the filter."
                : "New HR inquiries will appear here when employees submit them."}
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
                <Box>
                  {/* Display inquiry title */}
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
                    Employee ID: {inq.employeeId}
                  </Typography>

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

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Chip
                      icon={<BusinessIcon />}
                      label="Department: HR"
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

export default FetchInquiry;
