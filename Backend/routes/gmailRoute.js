const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config(); // Load environment variables
//import logo from "../../frontend/src/assets/images/logo1.png"; // Adjust the path as necessary

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "dinildulnethl@gmail.com",
    pass: process.env.EMAIL_PASS || "ihtp oyws smax adzy" // Use environment variables
  }
});

// API endpoint for sending task notifications
router.post("/send-task-notification", async (req, res) => {
  const { taskDetails, employeeEmail } = req.body;
  const logoPath = path.join(
    __dirname,
    "..",
    "..",
    "frontend",
    "src",
    "assets",
    "images",
    "logo1.png"
  );
  const mailOptions = {
    from: {
      name: "WorkSync",
      address: process.env.EMAIL_USER || "dinildulnethl@gmail.com"
    },
    to: "dinildulneth123@gmail.com",
    subject: "New Task Assignment",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:company-logo" alt="WorkSync Logo" style="width: 150px; height: auto;"/>
        </div>
        
        <!-- Title -->
        <h2 style="color: #2c3e50; text-align: center; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
          New Task Assignment
        </h2>
        
        <!-- Task Details Card -->
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 5px solid #3498db;">
          <h3 style="color: #0066cc; margin-top: 0;">${taskDetails.tName}</h3>
          
          <!-- Task Info Grid -->
          <div style="margin: 20px 0;">
            <div style="margin-bottom: 15px;">
              <p style="margin: 0; color: #666;">📝 <strong>Description:</strong></p>
              <p style="margin: 5px 0 0 24px; color: #2c3e50;">${
                taskDetails.description
              }</p>
            </div>
            
            <div style="margin-bottom: 15px;">
              <p style="margin: 0; color: #666;">⏰ <strong>Deadline:</strong></p>
              <p style="margin: 5px 0 0 24px; color: #2c3e50;">${new Date(
                taskDetails.deadLine
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}</p>
            </div>
            
            <div style="margin-bottom: 15px;">
              <p style="margin: 0; color: #666;">🎯 <strong>Priority:</strong></p>
              <p style="margin: 5px 0 0 24px; padding: 5px 10px; display: inline-block; border-radius: 15px; font-weight: bold; ${
                taskDetails.priority === "High"
                  ? "background-color: #ffe4e4; color: #ff4444;"
                  : taskDetails.priority === "Medium"
                  ? "background-color: #fff4e4; color: #ffa000;"
                  : "background-color: #e4ffe4; color: #00c853;"
              }">${taskDetails.priority}</p>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
          <p style="margin-bottom: 10px;">Please log in to your dashboard to view more details and get started.</p>
          <a href="http://localhost:3000/EmployeeHome/TaskDetails" 
             style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            View Task Details
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            This is an automated message from WorkSync. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: "logo1.png",
        path: logoPath,
        cid: "company-logo"
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "Task notification email sent successfully" });
  } catch (error) {
    console.error("Error sending task notification email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
