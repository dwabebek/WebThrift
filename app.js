const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Foto 15 MB dikirim sebagai base64, sehingga ukuran body JSON lebih besar dari file asli.
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Path absolut ke folder public
const publicPath = path.join(__dirname, "public");
const databasePath = path.join(__dirname, "database", "users.json");

function ensureDatabase() {
  const databaseDir = path.dirname(databasePath);

  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }

  if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(
      databasePath,
      JSON.stringify(
        [
          {
            username: "admin",
            password: "123",
            role: "admin",
            full_name: "Admin Thrift Lab",
            phone: "",
            address: "",
          },
        ],
        null,
        2,
      ),
    );
  }
}

function loadUsers() {
  ensureDatabase();
  return JSON.parse(fs.readFileSync(databasePath, "utf8"));
}

function saveUsers(users) {
  ensureDatabase();
  fs.writeFileSync(databasePath, JSON.stringify(users, null, 2));
}

function toPublicUser(user, options = {}) {
  const publicUser = {
    username: user.username,
    role: user.role,
    full_name: user.full_name || "",
    phone: user.phone || "",
    address: user.address || "",
  };

  if (options.includePhoto !== false) {
    publicUser.profile_photo = user.profile_photo || "";
  }

  return publicUser;
}

// 1. Sajikan file statis dari folder public
app.use(express.static(publicPath));

// 2. Route Utama (Membuka index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// 3. Route Register
app.post("/api/register", (req, res) => {
  const users = loadUsers();
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username dan password wajib diisi." });
  }

  if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ success: false, message: "Username sudah digunakan." });
  }

  users.push({
    username,
    password,
    role: "customer",
    full_name: req.body.full_name || "",
    phone: req.body.phone || "",
    address: req.body.address || "",
    profile_photo: "",
  });

  saveUsers(users);
  res.json({ success: true, message: "Pendaftaran berhasil. Silakan login." });
});

// 4. Route Login
app.post("/api/login", (req, res) => {
  const normalizedUsername = String(req.body.username || "").trim();
  const normalizedPassword = String(req.body.password || "");
  const users = loadUsers();
  const user = users.find((item) => item.username.toLowerCase() === normalizedUsername.toLowerCase());

  if (!user || user.password !== normalizedPassword) {
    return res.status(401).json({
      success: false,
      message: "Username atau password salah.",
    });
  }

  res.json({
    success: true,
    ...toPublicUser(user, { includePhoto: false }),
    message: "Login berhasil.",
  });
});

// 5. Ambil data profil user
app.get("/api/profile/:username", (req, res) => {
  const users = loadUsers();
  const username = String(req.params.username || "").trim();
  const user = users.find((item) => item.username.toLowerCase() === username.toLowerCase());

  if (!user) {
    return res.status(404).json({ success: false, message: "User tidak ditemukan." });
  }

  res.json({
    success: true,
    user: toPublicUser(user),
  });
});

// 6. Update data profil user
app.put("/api/profile/:username", (req, res) => {
  const users = loadUsers();
  const username = String(req.params.username || "").trim();
  const userIndex = users.findIndex((item) => item.username.toLowerCase() === username.toLowerCase());

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "User tidak ditemukan." });
  }

  users[userIndex].full_name = req.body.full_name || "";
  users[userIndex].phone = req.body.phone || "";
  users[userIndex].address = req.body.address || "";
  users[userIndex].profile_photo = req.body.profile_photo || "";

  if (req.body.password) {
    users[userIndex].password = String(req.body.password);
  }

  saveUsers(users);

  res.json({
    success: true,
    message: "Profil berhasil diperbarui.",
    user: toPublicUser(users[userIndex]),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server jalan di: http://localhost:${PORT}`);
  console.log(`Mencari file di: ${publicPath}`);
});
