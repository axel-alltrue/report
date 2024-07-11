import express from "express";
import axios from "axios";
import fs from "fs";
import carbone from "carbone";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;
const templateId = process.env.TEMPLATE_ID;
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
    const response = await axios.post(
      `https://api.carbone.io/render/${templateId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).send("Error generating report");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
