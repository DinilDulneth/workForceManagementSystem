const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/multer");

router.post("/", upload.single("media"), async (req, res) => {
  try {
    const result = await cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Upload failed" });
        }
        res.status(200).json({
          url: result.secure_url,
          public_id: result.public_id
        });
      })
      .end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
