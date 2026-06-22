🛍️Thrift.Lab – Modern Thrift E-Commerce Platform

> Sebuah platform web e-commerce adaptif yang dirancang khusus untuk memfasilitasi transaksi jual-beli pakaian bekas (_thrift shopping_) secara digital, cepat, dan interaktif.

---

Proyek ini dikembangkan dengan penuh dedikasi oleh:

- **[Brillian Naufal Abid]** ([202451080])
- **[Sandi Wahyu Mukti]** ([202451094])
- **[Dafa Nabil Nugroho]** ([202451095])
- **[Muhammad Yusfiandra Hidayat]** ([202451096])

---

## ✨ Fitur Unggulan

- **🔐 Secure Authentication System**: Alur registrasi (`register.html`) dan masuk akun (`login.html`) yang responsif dengan validasi data berbasis JSON.
- **🛒 Interactive Shopping Cart**: Manajemen keranjang belanja (`cart.html`) yang dinamis untuk menyimpan produk pilihan sebelum _checkout_.
- **💳 Seamless Checkout & Payment**: Simulasi alur pemesanan produk yang terintegrasi hingga proses pembayaran (`checkout.html` & `payment.html`).
- **📊 Centralized Admin Panel**: Halaman khusus admin (`admin.html`) untuk manajemen kontrol sistem dan pemantauan aktivitas toko.

---

## 🛠️ Tech Stack

Kombinasi teknologi yang digunakan untuk membangun platform ini:

- **Backend Engine:** Node.js 🚀
- **Web Framework:** Express.js 💻
- **Frontend Architecture:** HTML5, CSS3, & Vanilla JavaScript (ES6+) ✨
- **Data Interchange:** JSON (via `express.json()` & `urlencoded`) 📦

## 📂 Narasi Penjelasan Halaman

- **Halaman Utama (`index.html`)** — Pada halaman pertama atau _landing page_ ini, pengguna akan langsung disambut oleh katalog produk thrift terbaru, berbagai promo menarik, serta spanduk utama. Halaman ini berfungsi sebagai etalase digital sekaligus navigasi utama yang mengarahkan pengguna untuk menjelajahi seluruh fitur dan produk yang tersedia di platform kami.
- **Halaman Pendaftaran (`register.html`)** — Halaman ini menjadi gerbang awal bagi para pengguna baru untuk bergabung ke dalam platform dengan cara membuat akun. Di sini, terdapat formulir pengisian data penting seperti nama, email, dan kata sandi, di mana seluruh input tersebut nantinya akan divalidasi dan dikirim langsung ke sisi server untuk disimpan secara aman.
- **Halaman Masuk (`login.html`)** — Halaman ini berfungsi sebagai sistem autentikasi bagi para pengguna yang sudah terdaftar sebelumnya agar mereka bisa masuk ke akun masing-masing. Dengan mengisi email dan kata sandi yang benar, pengguna akan mendapatkan akses penuh ke fitur-fitur personal di dalam aplikasi, seperti mengelola keranjang belanja dan melihat profil mereka.
- **Halaman Keranjang (`cart.html`)** — Halaman keranjang belanja ini bertindak sebagai tempat penampungan sementara untuk semua produk thrift yang sudah dipilih dan ingin dibeli oleh pengguna. Pada halaman ini, pengguna dapat melihat daftar item secara mendetail, mengatur jumlah barang, melihat harga per item, serta memantau kalkulasi total biaya secara dinamis sebelum mereka melanjutkan ke proses berikutnya.
- **Halaman Proses Pesanan (`checkout.html`)** — Setelah selesai memilih produk di keranjang, pengguna akan diarahkan ke halaman ini untuk menyelesaikan proses administrasi pengiriman sebelum melakukan pembayaran. Di halaman ini, pengguna diwajibkan mengisi formulir alamat lengkap, memilih jasa kurir atau ekspedisi yang diinginkan, serta memeriksa kembali rangkuman akhir dari pesanan mereka.
- **Halaman Pembayaran (`payment.html`)** — Halaman ini memuat alur penyelesaian transaksi di mana pengguna dapat memilih berbagai metode pembayaran yang tersedia, mulai dari transfer bank hingga dompet digital. Di sini juga terdapat sistem simulasi interaktif yang akan memperbarui status transaksi secara langsung hingga pembayaran dinyatakan berhasil atau selesai diproses oleh sistem.
- **Halaman Profil (`profile.html`)** — Halaman ini didedikasikan khusus sebagai pusat manajemen akun bagi para pengguna terdaftar untuk melihat dan mengatur informasi personal mereka. Selain menampilkan data diri, halaman ini juga memuat riwayat seluruh pesanan atau pembelian yang pernah dilakukan, serta menyediakan opsi untuk memperbarui kata sandi atau informasi kontak.
- **Halaman Dasbor Admin (`admin.html`)** — Halaman ini merupakan panel kontrol internal yang terisolasi dan hanya bisa diakses oleh pengelola atau admin toko untuk manajemen operasional _back-office_. Melalui halaman ini, admin memiliki kendali penuh untuk memantau seluruh aktivitas transaksi yang masuk, mengelola data pengguna, serta melakukan pembaruan stok seperti menambah, mengubah, atau menghapus produk thrift yang tayang di katalog utama.

---

## Deploy ke Railway

### 🚀 Quick Start Deployment

1. **Persiapan Repository**
   - Pastikan file `package.json`, `app.js`, folder `public`, dan folder `database` ada di repository
   - Jika repository memiliki folder induk, set **Root Directory** di Railway ke `/WebThrift`

2. **Create Railway Service**
   - Login ke [railway.app](https://railway.app)
   - Buat project baru atau gunakan project yang sudah ada
   - Connect repository GitHub Anda
   - Railway otomatis akan detect Node.js dan menjalankan `npm start`

3. **Environment Configuration**
   - Railway secara otomatis mengatur `PORT` (jangan perlu dikonfigurasi)
   - Aplikasi sudah bind ke `0.0.0.0` sesuai kebutuhan Railway
   - (Opsional) Tambah variable jika menggunakan Railway Volume

4. **Data Persistence (Opsional tapi Disarankan)**
   - Untuk menjaga data tetap tersimpan setelah redeploy, buat **Railway Volume**:
     - Go to Variables → Add Volume
     - Mount point: `/data`
   - Tambah environment variable:
     ```env
     DATA_DIR=/data
     ```
   - Tanpa volume, file JSON tetap bisa dibuat saat runtime, tapi data bisa reset ketika service di-redeploy

5. **Monitoring & Logs**
   - Gunakan Railway Dashboard untuk monitor logs real-time
   - Aplikasi memiliki endpoint `/health` untuk health checks

### 📋 Pre-deployment Checklist

- ✅ `package.json` sudah di-update dengan metadata lengkap
- ✅ `app.js` sudah optimize dengan error handling dan graceful shutdown
- ✅ `railway.json` sudah dikonfigurasi dengan benar
- ✅ `.env.example` sudah ada sebagai referensi environment variables
- ✅ `.gitignore` sudah mencakup file-file yang tidak perlu di-push
- ✅ Semua dependencies di `package.json` sudah dicek
- ✅ PORT menggunakan `process.env.PORT`

### 🔧 Troubleshooting

| Masalah                    | Solusi                                                    |
| -------------------------- | --------------------------------------------------------- |
| Port already in use        | Railway secara otomatis assign PORT, tidak perlu khawatir |
| Data hilang setelah deploy | Setup Railway Volume dengan `DATA_DIR=/data`              |
| Aplikasi crash             | Check logs di Railway Dashboard, lihat error messages     |
| CORS errors di frontend    | CORS sudah di-handle di app.js dengan header yang tepat   |

### 📊 Performance Tips

- Aplikasi menggunakan JSON files sebagai database (cocok untuk development/learning)
- Untuk production scale besar, pertimbangkan migrasi ke database service seperti PostgreSQL
- Gunakan CDN untuk static files jika traffic tinggi
- Enable caching headers di response untuk static assets

---
..