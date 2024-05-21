const express = require("express");
const path = require("path");
const fs = require("fs");
// const PDFParser = require("pdf-parse");
const { getFileIdByRollno } = require("./services/fileData.service");
const {
  validateReqParaRollnumber,
} = require("./middlewares/validateRollno.middleware");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/static/admit", express.static(path.join(__dirname, "pdfs/admit")));

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
      // console.log(fileData);
      if (!fileData) {
        return res.status(404).json({
          message: "admit card not found for the roll no: " + rollNoInteger,
        });
      }
      return res.json({ fileData });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

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
