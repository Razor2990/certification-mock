const https = require("https");
const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
};

app.get("/certifications", function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Simula un retardo de 1 segundos
  setTimeout(() => {
    fs.readFile(
      __dirname + "/data/certifications.json",
      "utf8",
      (err, data) => {
        if (err) {
          console.error("Error reading certifications.json:", err);
          res.status(500).send({ error: "Internal Server Error" });
          return;
        }

        try {
          const certificationsData = JSON.parse(data);

          // Implementa la lógica de paginación
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedCertifications = certificationsData.slice(
            startIndex,
            endIndex
          );

          res.send({
            total: certificationsData.length,
            data: paginatedCertifications,
          });
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          res.status(500).send({ error: "Internal Server Error" });
        }
      }
    );
  }, 1000); // Simula un retardo de 1 segundos
});

app.get("/my-certifications", function (req, res) {
  res.sendFile(__dirname + "/data/my-certifications.json");
});

app.get("/approvals", function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Simula un retardo de 1 segundos
  setTimeout(() => {
    fs.readFile(__dirname + "/data/approvals.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading approvals.json:", err);
        res.status(500).send({ error: "Internal Server Error" });
        return;
      }

      try {
        const approvalsData = JSON.parse(data);

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedApprovals = approvalsData.slice(startIndex, endIndex);

        res.send({
          total: approvalsData.length,
          data: paginatedApprovals,
        });
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });
  }, 1000); // Simula un retardo de 1 segundos
});

app.get("/filters", function (req, res) {
  res.sendFile(__dirname + "/data/filters.json");
});

app.get("*", function (req, res) {
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  res.send({ status: 404, message: fullUrl + " Not Found" }, 404);
});

https.createServer(options, app).listen(3000, function (req, res) {
  console.log("Server started at https://localhost:3000/");
});
