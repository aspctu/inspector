const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const socket = require("./socket");
const watch = require("./watch");

const app = express();
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/document", (req, res) => {
  if (!req.query.filename) {
    return res.status(400).send("No filename was provided.");
  }
  res.sendFile(req.query.filename);
});

app.post("/document", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  let fileBuffer = req.files.file.data;
  let filePath = req.body.filepath;
  fs.writeFileSync(filePath, fileBuffer);
  res.json({ status: "success" });
});

const port = 8765;
app.listen(port, () => {
  console.log(`listening http://localhost:${port}`);
});
