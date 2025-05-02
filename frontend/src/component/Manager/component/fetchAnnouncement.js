import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  InputAdornment,
  IconButton,
  Tooltip,
  Fab,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CampaignIcon from "@mui/icons-material/Campaign";
import MessageIcon from "@mui/icons-material/Message";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export default function FetchAnnouncement() {
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editDialog, setEditDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState({
    _id: "",
    title: "",
    message: "",
  });
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const announcementContentRef = useRef(null);

  useEffect(() => {
    getAnnouncement();
  }, []);

  function getAnnouncement() {
    setLoading(true);
    axios
      .get("http://localhost:8070/api/announcement/getAnnouncement")
      .then((res) => {
        console.log("Fetched announcements (full response):", res.data);
        if (res.data.length > 0) {
          console.log("First announcement details:", {
            title: res.data[0].title,
            Title: res.data[0].Title,
            rawData: res.data[0],
          });
        }
        setAnnouncement(res.data);
      })
      .catch((err) => {
        console.error("Error fetching announcements:", err);
        setSnackbar({
          open: true,
          message: "Error fetching announcements: " + err.message,
          severity: "error",
        });
      })
      .finally(() => setLoading(false));
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function handleUpdate() {
    axios
      .put(
        `http://localhost:8070/api/announcement/updateAnnouncement/${editingAnnouncement._id}`,
        {
          title: editingAnnouncement.title,
          message: editingAnnouncement.message,
        }
      )
      .then((response) => {
        setSnackbar({
          open: true,
          message: "Announcement updated successfully!",
          severity: "success",
        });
        getAnnouncement();
        setEditDialog(false);
      })
      .catch((error) => {
        console.error("Error updating announcement:", error);
        setSnackbar({
          open: true,
          message: "Error updating announcement: " + error.message,
          severity: "error",
        });
      });
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      axios
        .delete(
          `http://localhost:8070/api/announcement/deleteAnnouncement/${id}`
        )
        .then((response) => {
          setSnackbar({
            open: true,
            message: "Announcement deleted successfully!",
            severity: "success",
          });
          getAnnouncement();
        })
        .catch((error) => {
          console.error("Error deleting announcement:", error);
          setSnackbar({
            open: true,
            message: "Error deleting announcement: " + error.message,
            severity: "error",
          });
        });
    }
  }

  const filteredAnnouncements = announcement.filter(
    (ann) =>
      ann.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.Title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const downloadPDF = async () => {
    if (!announcementContentRef.current || filteredAnnouncements.length === 0) {
      setSnackbar({
        open: true,
        message: "No announcements to download",
        severity: "warning",
      });
      return;
    }

    setIsPdfGenerating(true);

    try {
      const contentElement = announcementContentRef.current;

      // Create PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Set up header with logo
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Add logo - improved logo handling
      let logoLoaded = false;
      const logoImg = new Image();
      logoImg.crossOrigin = "Anonymous"; // Handle CORS issues

      // Try different paths for the logo
      const logoPath = "/logo1.png"; // Path to logo in public folder
      logoImg.src = logoPath;

      try {
        await new Promise((resolve, reject) => {
          logoImg.onload = () => {
            logoLoaded = true;
            resolve();
          };
          logoImg.onerror = (e) => {
            console.warn("Error loading logo from primary path:", e);
            reject(e);
          };
          // Fallback if image doesn't load after 3 seconds
          setTimeout(() => {
            if (!logoLoaded) {
              console.warn("Logo loading timed out, continuing without logo");
              resolve();
            }
          }, 3000);
        });
      } catch (logoError) {
        console.warn("Failed to load logo:", logoError);
        // Continue without the logo
      }

      // Add header background
      pdf.setFillColor(249, 249, 250);
      pdf.rect(0, 0, pageWidth, 45, "F");

      // Add logo if loaded successfully
      if (logoLoaded) {
        const logoWidth = 40; // Adjusted size
        const logoHeight = 16; // Adjusted size
        try {
          pdf.addImage(logoImg, "PNG", 10, 8, logoWidth, logoHeight);
        } catch (imageError) {
          console.warn("Failed to add logo to PDF:", imageError);
        }
      }

      // Format current date and time
      const now = new Date();
      const formattedDateTime = now.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      // Add "WORKFORCE" heading in all caps and bold
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.setTextColor("#fc6625"); // Company orange
      pdf.text("WorkSYNC", 55, 18);

      // Add date and time
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor("#666666");
      pdf.text(`Printed: ${formattedDateTime}`, 55, 25);

      // Add "Manager Announcements" subtitle
      pdf.setFontSize(16);
      pdf.setTextColor("#fc6625");
      pdf.text("Manager Announcements", 10, 40);

      // Add decorative line under header
      pdf.setDrawColor(252, 102, 37); // Orange line under header
      pdf.setLineWidth(0.5);
      pdf.line(10, 45, pageWidth - 10, 45);

      // Generate screenshot of content
      const canvas = await html2canvas(contentElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // Calculate dimensions with appropriate margins
      const imgWidth = pdf.internal.pageSize.getWidth() - 20; // Add some margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the PDF below the header
      pdf.addImage(imgData, "PNG", 10, 55, imgWidth, imgHeight);

      // Save the PDF
      pdf.save(
        `WorkSYNC_Manager_Announcements_${now.toISOString().slice(0, 10)}.pdf`
      );

      setSnackbar({
        open: true,
        message: "PDF downloaded successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setSnackbar({
        open: true,
        message: "Error generating PDF: " + error.message,
        severity: "error",
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

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
          <CampaignIcon sx={{ fontSize: 40, color: "#fc6625" }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #fc6625 30%, #e55a1c 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Announcements
          </Typography>
        </Box>

        <Tooltip title="Download as PDF" placement="left">
          <Fab
            color="primary"
            aria-label="download pdf"
            onClick={downloadPDF}
            disabled={
              isPdfGenerating || filteredAnnouncements.length === 0 || loading
            }
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1000,
              backgroundColor: "#fc6625",
              "&:hover": {
                backgroundColor: "#e55a1c",
              },
            }}
          >
            {isPdfGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <FileDownloadIcon />
              </motion.div>
            ) : (
              <PictureAsPdfIcon />
            )}
          </Fab>
        </Tooltip>

        <Box
          sx={{
            mb: 3,
            backgroundColor: "rgba(252, 102, 37, 0.05)",
            borderRadius: 2,
            padding: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#fc6625" }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={clearSearch}
                    edge="end"
                    sx={{ color: "#e55a1c" }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderColor: "rgba(252, 102, 37, 0.5)",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fc6625",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fc6625",
                },
              },
            }}
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
        </Box>

        {loading && (
          <LinearProgress
            sx={{ mb: 3, backgroundColor: "rgba(252, 102, 37, 0.2)" }}
          />
        )}

        {!loading && filteredAnnouncements.length === 0 && (
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
              {searchQuery
                ? `No announcements match "${searchQuery}"`
                : "No announcements available"}
            </Typography>
          </Box>
        )}

        <Box ref={announcementContentRef}>
          <AnimatePresence>
            {filteredAnnouncements.map((ann, index) => (
              <motion.div
                key={ann._id}
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
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#fc6625",
                      fontWeight: 700,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CampaignIcon sx={{ color: "#fc6625" }} />
                    {console.log("Current announcement data:", ann)}
                    {ann.title || ann.Title || "No Title"}
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
                    {ann.message}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Chip
                        icon={<PersonIcon />}
                        label={`From: ${ann.sender || "Admin"}`}
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
                        label={formatDate(ann.date)}
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
                            setEditingAnnouncement({
                              _id: ann._id,
                              title: ann.title,
                              message: ann.message,
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
                          onClick={() => handleDelete(ann._id)}
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
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      </motion.div>

      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "#fc6625", fontWeight: 600 }}>
          Edit Announcement
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editingAnnouncement.title}
            onChange={(e) =>
              setEditingAnnouncement({
                ...editingAnnouncement,
                title: e.target.value,
              })
            }
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Message"
            value={editingAnnouncement.message}
            onChange={(e) =>
              setEditingAnnouncement({
                ...editingAnnouncement,
                message: e.target.value,
              })
            }
            multiline
            rows={4}
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
