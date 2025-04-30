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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CampaignIcon from "@mui/icons-material/Campaign";
import MessageIcon from "@mui/icons-material/Message";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FetchAnnouncement() {
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    getAnnouncement();
  }, []);

  function getAnnouncement() {
    setLoading(true);
    axios
      .get("http://localhost:8070/api/announcement/getAnnouncement")
      .then((res) => {
        console.log("Fetched announcements (full response):", res.data);
        // Add detailed logging for first announcement
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
        console.error("Error fetching announcements:", err); // Add this log
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
        getAnnouncement(); // Refresh the announcements list
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
          getAnnouncement(); // Refresh the list
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

        {loading && (
          <LinearProgress
            sx={{ mb: 3, backgroundColor: "rgba(252, 102, 37, 0.2)" }}
          />
        )}

        <AnimatePresence>
          {announcement.map((ann, index) => (
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
                  {ann.title || ann.Title || "No Title"} {/* Try both cases */}
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
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
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
                        "&:hover": {
                          backgroundColor: "rgba(252, 102, 37, 0.1)",
                        },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(ann._id)}
                      sx={{
                        color: "#e55a1c",
                        "&:hover": {
                          backgroundColor: "rgba(229, 90, 28, 0.1)",
                        },
                      }}
                    >
                      Delete
                    </Button>
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
