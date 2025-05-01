const multer = require("multer");

const storage = multer.memoryStorage();
// For task attachments (PDF, JPG, PNG, PGN)
const taskAttachment = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|jpeg|jpg|png|pgn/;
    const extname = fileTypes.test(file.originalname.toLowerCase());
    const mimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/x-chess-pgn"
    ];
    const mimetype = mimeTypes.includes(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only PDF, JPG, PNG, or PGN files are allowed"));
  }
});

module.exports = taskAttachment;
