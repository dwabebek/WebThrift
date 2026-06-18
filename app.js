const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
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
const usersDatabasePath = path.join(__dirname, "database", "users.json");
const productsDatabasePath = path.join(__dirname, "database", "products.json");
const fallbackProductImage = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80";
const defaultProducts = [
  { id: 1, name: "Vintage Nike Windbreaker", category: "jaket", price: 150000, size: "L", condition: "9/10 Mulus", image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80", status: "available" },
  { id: 2, name: "Stussy Graphic Tee", category: "baju", price: 120000, size: "M", condition: "8/10", image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80", status: "available" },
  { id: 3, name: "Dickies 874 Work Pants", category: "celana", price: 180000, size: "32", condition: "Like New", image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80", status: "available" },
  { id: 4, name: "New Balance 990v5", category: "sepatu", price: 450000, size: "42", condition: "7/10", image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80", status: "available" },
];

function ensureJsonDatabase(filePath, initialData) {
  const databaseDir = path.dirname(filePath);

  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
  }
}

function loadUsers() {
  ensureJsonDatabase(usersDatabasePath, [
    {
      username: "admin",
      password: "123",
      role: "admin",
      full_name: "Admin Thrift Lab",
      phone: "",
      address: "",
      profile_photo: "",
    },
  ]);
  return JSON.parse(fs.readFileSync(usersDatabasePath, "utf8"));
}

function saveUsers(users) {
  ensureJsonDatabase(usersDatabasePath, []);
  fs.writeFileSync(usersDatabasePath, JSON.stringify(users, null, 2));
}

function loadProducts() {
  ensureJsonDatabase(productsDatabasePath, defaultProducts);
  return JSON.parse(fs.readFileSync(productsDatabasePath, "utf8"));
}

function saveProducts(products) {
  ensureJsonDatabase(productsDatabasePath, defaultProducts);
  fs.writeFileSync(productsDatabasePath, JSON.stringify(products, null, 2));
}

function normalizeProduct(input, fallback = {}) {
  const price = Number(input.price ?? fallback.price ?? 0);

  return {
    id: Number(input.id || fallback.id || Date.now()),
    name: String(input.name ?? fallback.name ?? "").trim(),
    category: String(input.category ?? fallback.category ?? "baju").trim().toLowerCase(),
    size: String(input.size ?? fallback.size ?? "").trim(),
    condition: String(input.condition ?? fallback.condition ?? "").trim(),
    price: Number.isFinite(price) && price >= 0 ? price : 0,
    image_url: input.image_url || fallback.image_url || fallbackProductImage,
    status: input.status || fallback.status || "available",
  };
}

function isValidProduct(product) {
  return Boolean(product.name && product.category && product.size && product.condition);
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

// 7. Ambil semua produk
app.get("/api/products", (req, res) => {
  res.json({
    success: true,
    products: loadProducts(),
  });
});

// 8. Tambah produk
app.post("/api/products", (req, res) => {
  const products = loadProducts();
  const product = normalizeProduct(req.body);

  if (!isValidProduct(product)) {
    return res.status(400).json({ success: false, message: "Nama, kategori, size, dan kondisi barang wajib diisi." });
  }

  if (products.some((item) => Number(item.id) === Number(product.id))) {
    product.id = Date.now();
  }

  products.unshift(product);
  saveProducts(products);

  res.status(201).json({
    success: true,
    message: "Produk berhasil ditambahkan.",
    product,
  });
});

// 9. Update produk
app.put("/api/products/:id", (req, res) => {
  const products = loadProducts();
  const productId = Number(req.params.id);
  const productIndex = products.findIndex((item) => Number(item.id) === productId);

  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
  }

  const product = normalizeProduct(req.body, products[productIndex]);
  product.id = products[productIndex].id;

  if (!isValidProduct(product)) {
    return res.status(400).json({ success: false, message: "Nama, kategori, size, dan kondisi barang wajib diisi." });
  }

  products[productIndex] = product;
  saveProducts(products);

  res.json({
    success: true,
    message: "Produk berhasil diperbarui.",
    product,
  });
});

// 10. Hapus produk
app.delete("/api/products/:id", (req, res) => {
  const products = loadProducts();
  const productId = Number(req.params.id);
  const nextProducts = products.filter((item) => Number(item.id) !== productId);

  if (nextProducts.length === products.length) {
    return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
  }

  saveProducts(nextProducts);

  res.json({
    success: true,
    message: "Produk berhasil dihapus.",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server jalan di: http://localhost:${PORT}`);
  console.log(`Mencari file di: ${publicPath}`);
});
