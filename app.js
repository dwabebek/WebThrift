const express = require("express");
const path = require("path");
const app = express();

// Konfigurasi agar Express bisa membaca data JSON dari form (PENTING untuk register/login)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path absolut ke folder public
const publicPath = path.join(__dirname, "public");

// 1. Sajikan file statis dari folder public
app.use(express.static(publicPath));

// 2. Route Utama (Membuka index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// 3. Dummy Route untuk Register (Agar error 404 hilang)
app.post("/api/register", (req, res) => {
  console.log("Data diterima:", req.body);
  res.json({ success: true, message: "Berhasil terhubung!" });
});

// 4. Dummy Route untuk Login
app.post("/api/login", (req, res) => {
  res.json({ success: true, role: "customer" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server jalan di: http://localhost:${PORT}`);
  console.log(`Mencari file di: ${publicPath}`);
});
