const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();

dotenv.config(); // Load environment variables once

const PORT = process.env.PORT || 8070;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

// MongoDB connection
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection success!");
});

const taskRouter = require("./routes/taskRoutes");
app.use("/task", taskRouter); // this is the link name

const workingHRouter = require("./routes/workingHRoutes");
app.use("/workingH", workingHRouter); // this is the link name

const employee = require("./routes/employeeRoutes");
app.use("/employee", employee); // this is the link name

const hrRoutes = require("./routes/hrRoutes");
app.use("/hr", hrRoutes); // this is the link name

const managerRoutes = require("./routes/managerRoutes");
app.use("/manager", managerRoutes); // this is the link name

const leaveRoutes = require("./routes/leaveRoutes");
app.use("/leave", leaveRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

const empResignation = require("./routes/eResignation");
app.use("/resignation", empResignation); // this is the link name

const empRegistration = require("./routes/employeeRoutes");
app.use("/registration", empRegistration); // this is the link name

const AnnouncementRouter = require("./routes/announcementRoute");
app.use("/api/announcement", AnnouncementRouter); // this is the link name

const FeedbackRouter = require("./routes/feedbackRoute");
app.use("/api/feedback", FeedbackRouter); // this is the link name

const inquiryRouter = require("./routes/inquiryRoute");
app.use("/api/inquiry", inquiryRouter); // this is the link name

const salaryRoutes = require("./routes/salaryRoutes");
app.use("/salary", salaryRoutes);

const gmailRoutes = require("./routes/gmailRoute");
app.use("/api/gmail", gmailRoutes); // this is the link name

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});
