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

## 👨‍💻 Pembagian Kontribusi Per Anggota

Berikut rincian fitur dan bagian kode yang dikerjakan oleh masing-masing anggota kelompok.

| # | Anggota | NIM | Fitur yang Dikerjakan | Halaman |
|---|---------|-----|-----------------------|---------|
| 1 | Brillian Naufal Abid | 202451080 | Index & Profile | `index.html` , `profile.html` |
| 2 | Sandi Wahyu Mukti | 202451094 | Login & Register | `login.html` , `register.html` |
| 3 | Dafa Nabil Nugroho | 202451095 | Cart & Admin | `cart.html` , `admin.html` |
| 4 | Muhammad Yusfiandra Hidayat | 202451096 | Checkout & Payment | `checkout.html` , `payment` |

## 📂 Narasi Penjelasan Halaman

- **Halaman Utama (`index.html`)** — Pada halaman pertama atau _landing page_ ini, pengguna akan langsung disambut oleh katalog produk thrift terbaru, berbagai promo menarik, serta spanduk utama. Halaman ini berfungsi sebagai etalase digital sekaligus navigasi utama yang mengarahkan pengguna untuk menjelajahi seluruh fitur dan produk yang tersedia di platform kami.
- **Halaman Pendaftaran (`register.html`)** — Halaman ini menjadi gerbang awal bagi para pengguna baru untuk bergabung ke dalam platform dengan cara membuat akun. Di sini, terdapat formulir pengisian data penting seperti nama, email, dan kata sandi, di mana seluruh input tersebut nantinya akan divalidasi dan dikirim langsung ke sisi server untuk disimpan secara aman.
- **Halaman Masuk (`login.html`)** — Halaman ini berfungsi sebagai sistem autentikasi bagi para pengguna yang sudah terdaftar sebelumnya agar mereka bisa masuk ke akun masing-masing. Dengan mengisi email dan kata sandi yang benar, pengguna akan mendapatkan akses penuh ke fitur-fitur personal di dalam aplikasi, seperti mengelola keranjang belanja dan melihat profil mereka.
- **Halaman Keranjang (`cart.html`)** — Halaman keranjang belanja ini bertindak sebagai tempat penampungan sementara untuk semua produk thrift yang sudah dipilih dan ingin dibeli oleh pengguna. Pada halaman ini, pengguna dapat melihat daftar item secara mendetail, mengatur jumlah barang, melihat harga per item, serta memantau kalkulasi total biaya secara dinamis sebelum mereka melanjutkan ke proses berikutnya.
- **Halaman Proses Pesanan (`checkout.html`)** — Setelah selesai memilih produk di keranjang, pengguna akan diarahkan ke halaman ini untuk menyelesaikan proses administrasi pengiriman sebelum melakukan pembayaran. Di halaman ini, pengguna diwajibkan mengisi formulir alamat lengkap, serta memeriksa kembali rangkuman akhir dari pesanan mereka.
- **Halaman Pembayaran (`payment.html`)** — Halaman ini memuat alur penyelesaian transaksi di mana pengguna dapat memilih berbagai metode pembayaran yang tersedia, mulai dari transfer bank hingga dompet digital. Di sini juga terdapat sistem simulasi interaktif yang akan memperbarui status transaksi secara langsung hingga pembayaran dinyatakan berhasil atau selesai diproses oleh sistem.
- **Halaman Profil (`profile.html`)** — Halaman ini didedikasikan khusus sebagai pusat manajemen akun bagi para pengguna terdaftar untuk melihat dan mengatur informasi personal mereka. Selain menampilkan data diri, halaman ini juga memuat riwayat seluruh pesanan atau pembelian yang pernah dilakukan, serta menyediakan opsi untuk memperbarui kata sandi atau informasi kontak.
- **Halaman Dasbor Admin (`admin.html`)** — Halaman ini merupakan panel kontrol internal yang terisolasi dan hanya bisa diakses oleh pengelola atau admin toko untuk manajemen operasional _back-office_. Melalui halaman ini, admin memiliki kendali penuh untuk memantau seluruh aktivitas transaksi yang masuk, mengelola data pengguna, serta melakukan pembaruan stok seperti menambah, mengubah, atau menghapus produk thrift yang tayang di katalog utama.

---

