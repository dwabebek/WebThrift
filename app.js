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

app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Data yang dikirim terlalu besar. Kompres gambar atau pilih file yang lebih kecil.",
    });
  }

  return next(err);
});

// Path absolut ke folder public
const publicPath = path.join(__dirname, "public");
const dataPath = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, "database");
const usersDatabasePath = path.join(dataPath, "users.json");
const productsDatabasePath = path.join(dataPath, "products.json");
const ordersDatabasePath = path.join(dataPath, "orders.json");
const fallbackProductImage = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80";
const shippingCost = 15000;
const validPaymentMethods = ["BCA", "BRI", "DANA", "OVO", "SHOPEE"];
const defaultUsers = [
  {
    username: "admin",
    password: "123",
    role: "admin",
    full_name: "Admin Thrift Lab",
    phone: "",
    address: "",
    profile_photo: "",
  },
];
const defaultProducts = [
  { id: 1, name: "Vintage Nike Windbreaker", category: "jaket", price: 150000, size: "L", condition: "9/10 Mulus", image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80", status: "available" },
  { id: 2, name: "Stussy Graphic Tee", category: "baju", price: 120000, size: "M", condition: "8/10", image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80", status: "available" },
  { id: 3, name: "Dickies 874 Work Pants", category: "celana", price: 180000, size: "32", condition: "Like New", image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80", status: "available" },
  { id: 4, name: "New Balance 990v5", category: "sepatu", price: 450000, size: "42", condition: "7/10", image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80", status: "available" },
];
const defaultOrders = [];

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function ensureJsonDatabase(filePath, initialData) {
  const databaseDir = path.dirname(filePath);

  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    writeJsonFile(filePath, initialData);
  }
}

function writeJsonFile(filePath, data) {
  const databaseDir = path.dirname(filePath);

  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readJsonFile(filePath, initialData) {
  ensureJsonDatabase(filePath, initialData);

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(parsed) ? parsed : cloneData(initialData);
  } catch (error) {
    const backupPath = `${filePath}.broken-${Date.now()}`;

    try {
      if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, backupPath);
      }
    } catch (backupError) {
      console.warn(`Gagal membuat backup database rusak: ${backupError.message}`);
    }

    writeJsonFile(filePath, initialData);
    return cloneData(initialData);
  }
}

function loadUsers() {
  return readJsonFile(usersDatabasePath, defaultUsers);
}

function saveUsers(users) {
  writeJsonFile(usersDatabasePath, users);
}

function loadProducts() {
  return readJsonFile(productsDatabasePath, defaultProducts);
}

function saveProducts(products) {
  writeJsonFile(productsDatabasePath, products);
}

function loadOrders() {
  return readJsonFile(ordersDatabasePath, defaultOrders);
}

function saveOrders(orders) {
  writeJsonFile(ordersDatabasePath, orders);
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

function normalizeProductStatus(status) {
  return String(status || "").trim().toLowerCase();
}

function formatCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function createOrderId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizePaymentMethod(method) {
  const normalizedMethod = String(method || "").trim().toUpperCase();
  return validPaymentMethods.includes(normalizedMethod) ? normalizedMethod : "BCA";
}

function normalizeOrderItem(product) {
  return {
    id: Number(product.id),
    name: product.name,
    category: product.category,
    size: product.size,
    condition: product.condition,
    price: Number(product.price) || 0,
    image_url: product.image_url || fallbackProductImage,
  };
}

function getOrderProductIds(order) {
  return [
    ...new Set(
      (order.items || [])
        .map((item) => Number(item.id))
        .filter((id) => Number.isFinite(id)),
    ),
  ];
}

function findOrderIndexById(orders, orderId) {
  return orders.findIndex((order) => String(order.id) === String(orderId));
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

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
  });
});

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

// 10. Update status produk
app.put("/api/products/:id/status", (req, res) => {
  const products = loadProducts();
  const productId = Number(req.params.id);
  const productIndex = products.findIndex((item) => Number(item.id) === productId);
  const nextStatus = normalizeProductStatus(req.body.status);

  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
  }

  if (!["available", "sold_out"].includes(nextStatus)) {
    return res.status(400).json({ success: false, message: "Status produk tidak valid." });
  }

  products[productIndex].status = nextStatus;
  saveProducts(products);

  res.json({
    success: true,
    message: "Status produk berhasil diperbarui.",
    product: products[productIndex],
  });
});

// 11. Hapus produk
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

// 12. Ambil semua order untuk admin
app.get("/api/orders", (req, res) => {
  res.json({
    success: true,
    orders: loadOrders(),
  });
});

// 13. Buat order setelah checkout
app.post("/api/orders", (req, res) => {
  const requestedItems = Array.isArray(req.body.items) ? req.body.items : [];
  const products = loadProducts();
  const orders = loadOrders();

  if (requestedItems.length === 0) {
    return res.status(400).json({ success: false, message: "Keranjang kosong." });
  }

  const orderItems = requestedItems.map((item) => {
    const product = products.find((productItem) => Number(productItem.id) === Number(item.id));
    return product ? normalizeOrderItem(product) : null;
  });

  if (orderItems.some((item) => !item)) {
    return res.status(400).json({ success: false, message: "Sebagian produk tidak ditemukan. Muat ulang katalog lalu checkout kembali." });
  }

  const unavailableProduct = orderItems.find((item) => {
    const product = products.find((productItem) => Number(productItem.id) === Number(item.id));
    return product && product.status !== "available";
  });

  if (unavailableProduct) {
    return res.status(409).json({ success: false, message: `${unavailableProduct.name} sudah tidak tersedia.` });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + shippingCost;
  const now = new Date();
  const order = {
    id: createOrderId(),
    items: orderItems,
    customer: {
      name: String(req.body.customer_name || "").trim(),
      phone: String(req.body.phone || "").trim(),
      address: String(req.body.address || "").trim(),
    },
    subtotal,
    shipping_cost: shippingCost,
    total,
    total_label: formatCurrency(total),
    date: now.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
    created_at: now.toISOString(),
    status: "pending_payment",
    paymentMethod: normalizePaymentMethod(req.body.payment_method || req.body.paymentMethod),
    proof: "",
    proofName: "",
    proofUploadedAt: "",
    verifiedAt: "",
  };

  if (!order.customer.name || !order.customer.phone || !order.customer.address) {
    return res.status(400).json({ success: false, message: "Nama, WhatsApp, dan alamat pengiriman wajib diisi." });
  }

  orders.push(order);
  saveOrders(orders);

  res.status(201).json({
    success: true,
    message: "Order berhasil dibuat.",
    order,
  });
});

// 14. Ambil satu order untuk halaman pembayaran
app.get("/api/orders/:id", (req, res) => {
  const orders = loadOrders();
  const orderIndex = findOrderIndexById(orders, req.params.id);

  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: "Order tidak ditemukan." });
  }

  res.json({
    success: true,
    order: orders[orderIndex],
  });
});

// 15. Upload bukti pembayaran
app.put("/api/orders/:id/proof", (req, res) => {
  const orders = loadOrders();
  const orderIndex = findOrderIndexById(orders, req.params.id);
  const proof = String(req.body.proof || "");

  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: "Order tidak ditemukan." });
  }

  if (!proof.startsWith("data:image/")) {
    return res.status(400).json({ success: false, message: "Bukti pembayaran harus berupa gambar." });
  }

  orders[orderIndex].proof = proof;
  orders[orderIndex].proofName = String(req.body.proof_name || req.body.proofName || "bukti-pembayaran");
  orders[orderIndex].proofUploadedAt = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  orders[orderIndex].status = "pending_verification";
  saveOrders(orders);

  res.json({
    success: true,
    message: "Bukti pembayaran berhasil dikirim.",
    order: orders[orderIndex],
  });
});

// 16. Verifikasi order dan tandai produk sold out
app.put("/api/orders/:id/verify", (req, res) => {
  const orders = loadOrders();
  const orderIndex = findOrderIndexById(orders, req.params.id);

  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: "Order tidak ditemukan." });
  }

  const order = orders[orderIndex];

  if (!order.proof) {
    return res.status(400).json({ success: false, message: "Order belum memiliki bukti pembayaran." });
  }

  const productIds = getOrderProductIds(order);

  if (productIds.length === 0) {
    return res.status(400).json({ success: false, message: "Produk pada order tidak ditemukan." });
  }

  const products = loadProducts();
  const missingProducts = productIds.filter((id) => !products.some((product) => Number(product.id) === Number(id)));

  if (missingProducts.length > 0) {
    return res.status(404).json({ success: false, message: "Sebagian produk pada order tidak ditemukan." });
  }

  productIds.forEach((id) => {
    const productIndex = products.findIndex((product) => Number(product.id) === Number(id));
    products[productIndex].status = "sold_out";
  });

  orders[orderIndex].status = "success";
  orders[orderIndex].verifiedAt = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  saveProducts(products);
  saveOrders(orders);

  res.json({
    success: true,
    message: "Pembayaran berhasil diverifikasi. Produk sudah ditandai sold out.",
    order: orders[orderIndex],
  });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Server jalan di: http://${HOST}:${PORT}`);
  console.log(`Mencari file di: ${publicPath}`);
  console.log(`Menyimpan data di: ${dataPath}`);
});
