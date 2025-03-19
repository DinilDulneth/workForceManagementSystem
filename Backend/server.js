const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8070;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

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

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});
