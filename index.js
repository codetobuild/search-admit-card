const express = require("express");
const path = require("path");
const fs = require("fs");
const { visitorTracker } = require("./middlewares/visitorTract.middleware");
// const PDFParser = require("pdf-parse");
const { getFileIdByRollno } = require("./services/fileData.service");
const {
  validateReqParaRollnumber,
} = require("./middlewares/validateRollno.middleware");

const app = express();

app.set("trust proxy", true);
app.use(express.static(path.join(__dirname, "public")));
app.use(visitorTracker);

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get(
  "/api/v1/admit/:rollNo",
  validateReqParaRollnumber,
  async (req, res) => {
    try {
      const paramRollno = req.params.rollNo;
      const rollNoInteger = parseInt(paramRollno, 10);
      const fileData = getFileIdByRollno(rollNoInteger);
      // console.log(rollNoInteger);
      // console.log(fileData);
      if (!fileData) {
        return res.status(404).json({
          message: "admit card not found for the roll no: " + rollNoInteger,
        });
      }
      return res.json({
        fileData,
        visitorCount: req.visitorCount ? req.visitorCount : 0,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get("/api/v1/visitor-count", (req, res) => {
  if (req.visitorCount) {
    return res.json({ visitorCount: req.visitorCount });
  } else {
    return res.status(404).json({ error: "Not Found" });
  }
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Unknown path handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server successfully running on port 5000");
});
