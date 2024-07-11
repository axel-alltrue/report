import express from "express";
import fs from "fs";
import carbone from "carbone";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";

dotenv.config();

const app = express();
const PORT = 3000;
const templateML = process.env.TEMPLATE_ML_ID;
const templatePentest = process.env.TEMPLATE_PENTEST_ID;
const token = process.env.TOKEN;

app.use(express.json());

app.post("/generate-report/local", async (req, res) => {
  const data = req.body;
  carbone.render("./pentest_template_test.docx", data, function (err, result) {
    if (err) {
      console.error("Error generating report:", err);
      res.status(500).send("Error generating report");
    }

    fs.writeFileSync("pentest_report.docx", result);
    console.log("write");
  });
  res.status(200).send("Succeed genereting report");
});
app.post("/generate-report/template-id", async (req, res) => {
  try {
    const data = req.body;
    const templateId = data.report === "ML" ? templateML : templatePentest;

    const response = await fetch(
      `https://api.carbone.io/render/${templateId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    const renderId = result?.data?.renderId;
    const fileUrl = `https://api.carbone.io/render/${renderId}`;

    const fileResponse = await fetch(fileUrl);
    console.log(fileResponse);
    if (!fileResponse.ok) {
      throw new Error(`HTTP error! Status: ${fileResponse.status}`);
    }

    const filePath = path.join("./", `${renderId}.pdf`);
    const fileStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      fileResponse.body.pipe(fileStream);
      fileResponse.body.on("error", (err) => {
        reject(err);
      });
      fileStream.on("finish", () => {
        res.status(200).json({
          success: true,
          message: "Document rendered and downloaded successfully",
          renderUrl: fileUrl,
          renderId: renderId,
        });
        resolve();
      });
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({
      success: false,
      message: "Error rendering document",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
