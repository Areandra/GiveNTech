# 📚 GiveNTech - Sistem Manajemen Peminjaman Fasilitas & Barang Kampus

Sistem informasi manajemen peminjaman fasilitas/barang modern untuk kampus, organisasi, dan perusahaan. Terintegrasi dengan booking online, QR Code verification, approval workflow, tracking lokasi ruangan, serta notifikasi real-time (WhatsApp Cloud API). Dirancang full-stack dengan arsitektur scalable dan modular menggunakan AdonisJS 6.

---

## 🎯 Quick Info

| Aspek            | Detail                             |
| ---------------- | ---------------------------------- |
| **Framework**    | AdonisJS 6 (Full-Stack TypeScript) |
| **Frontend**     | React 19 + InertiaJS               |
| **Backend**      | Node.js 20+                        |
| **Database**     | MySQL/MariaDB 10.4+                |
| **Cache/OTP**    | Redis 6+ (Optional)                |
| **API**          | REST + GraphQL                     |
| **Realtime**     | Socket.IO                          |
| **Maps**         | Leaflet                            |
| **Notifikasi**   | WhatsApp Cloud API                 |
| **Port Default** | 3333                               |
| **Language**     | TypeScript (99%), Other (1%)       |

---

![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![npm](https://img.shields.io/badge/npm-11.6+-blue)
![AdonisJS](https://img.shields.io/badge/AdonisJS-6-%236E4AFF)
![React](https://img.shields.io/badge/React-19-61DAFB)
![InertiaJS](https://img.shields.io/badge/InertiaJS-React-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-%233178C6)
![Vite](https://img.shields.io/badge/Vite-6-yellow)
![GraphQL](https://img.shields.io/badge/GraphQL-API-e10098)
![Redis](https://img.shields.io/badge/Redis-6+-DC382D)
![MySQL](https://img.shields.io/badge/MySQL-8+-4479A1)
![QRCode](https://img.shields.io/badge/QR_Code-qrcode-green)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Cloud_API-25D366)
![Leaflet](https://img.shields.io/badge/Maps-Leaflet-green)
![License](https://img.shields.io/badge/license-MIT-red)

---

## 📖 Daftar Isi

* [Overview](#-overview)
* [Use Case & Target Pengguna](#-use-case--target-pengguna)
* [Fitur Utama](#-fitur-utama)
* [Kebutuhan Sistem](#-kebutuhan-sistem)
* [Quick Start](#-quick-start)
* [Instalasi & Setup Lengkap](#-instalasi--setup-lengkap)
* [Environment Configuration Lengkap](#-environment-configuration-lengkap)
* [Fitur & Role System](#-fitur--role-system)
* [Alur Penggunaan Lengkap](#-alur-penggunaan-lengkap)
* [OTP & Redis Management](#-otp--redis-management)
* [API Routes Lengkap](#-api-routes-lengkap)
* [GraphQL Endpoint](#-graphql-endpoint)
* [Developer Commands](#-developer-commands)
* [Project Structure](#-project-structure)
* [Troubleshooting](#-troubleshooting)
* [Kontribusi & Lisensi](#-kontribusi--lisensi)

---

## 📋 Overview

**GiveNTech** adalah platform manajemen peminjaman fasilitas/barang kampus yang dirancang untuk:

✅ **Booking Online** - User dapat booking fasilitas secara real-time  
✅ **Approval Workflow** - Admin/Approver dapat approve/reject dengan mudah  
✅ **QR Code Verification** - Setiap booking punya QR unik untuk tracking pickup/return  
✅ **Status Tracking** - Real-time tracking dari Pending hingga Done  
✅ **Location Tracking** - Setiap booking mencatat ruangan mana yang digunakan (lat/long)  
✅ **Map Display** - Leaflet map untuk visualisasi lokasi ruangan  
✅ **WhatsApp Notifications** - Notifikasi otomatis approval ke WhatsApp user  
✅ **Dashboard Analytics** - Statistik peminjaman, fasilitas rusak, grafik  
✅ **Dual API** - REST API + GraphQL untuk fleksibilitas integrasi  
✅ **Real-time Sync** - Socket.IO untuk live update antar device  
✅ **Role Management** - Admin, Approver, User dengan permission berbeda  
✅ **Fasilitas Management** - CRUD lengkap untuk master data  

---

## 🏫 Use Case & Target Pengguna

* 🏫 **Universitas / Sekolah** - Manajemen ruang kelas, laboratorium, peralatan
* 🔬 **Laboratorium** - Sharing equipment dan peralatan lab
* 📚 **Perpustakaan** - Peminjaman buku, fasilitas study, ruang baca
* 🏢 **Kampus** - Aula, meeting room, peralatan kantor
* 🏭 **Perusahaan** - Asset management, equipment rental
* 🚗 **Transportasi** - Vehicle rental, peralatan transportasi

---

## ⭐ Fitur Utama

### 1. **Booking System**
- Form booking dengan date picker
- Pilih ruangan via map (Leaflet)
- Catat tujuan peminjaman
- Approve/reject dengan notifikasi

### 2. **QR Code Verification**
- QR unik per booking
- HMAC signature untuk keamanan
- Scan saat pickup & return
- Track status real-time

### 3. **Status Workflow**
```
Pending → Confirmed → Picked Up → Returned → Done
   (Approver approve)    (Scan QR)    (Scan QR)
```

### 4. **Location Tracking**
- Setiap booking record lokasi ruangan
- Latitude/Longitude untuk map
- Leaflet map display
- History peminjaman per ruangan

### 5. **Role Management**
- **Admin** - Full access
- **Approver** - Approve booking
- **User** - Booking & track status

### 6. **Notifications**
- WhatsApp Cloud API
- Email notifications
- Socket.IO real-time updates

### 7. **Dashboard Analytics**
- Grafik booking 7 hari
- Statistik fasilitas rusak
- Total user terdaftar
- Availability status real-time

### 8. **Fasilitas Management**
- CRUD facility
- Status management (Available, Booked, Borrowed, Damaged, etc)
- Facility type classification

---

## ⚙️ Kebutuhan Sistem

### System Requirements

```
Node.js:        ≥ 20.x (LTS)      ✅ Tested: 20.11.0, 24.11.0
npm:            ≥ 10.x            ✅ Tested: 11.6.4
MySQL/MariaDB:  ≥ 8.x / 10.4.32   ✅ Tested: MariaDB 10.4.32
Redis:          ≥ 6.x             ⚠️  Optional (untuk OTP)
OS:             Windows/Linux/Mac  ✅ Tested: Win 11, Ubuntu 24.04
```

### Tools Development (Rekomendasi)

| Tool | Purpose | Link |
|------|---------|------|
| **VSCode** | Code Editor | [Download](https://code.visualstudio.com/) |
| **DBeaver** | Database GUI | [Download](https://dbeaver.io/) |
| **Postman** | API Testing | [Download](https://www.postman.com/) |
| **Git Bash** | Version Control | [Download](https://gitforwindows.org/) |
| **Docker** | Container (Opsional) | [Download](https://www.docker.com/) |

---

## ⚡ Quick Start

```bash
# Clone repository
git clone https://github.com/Areandra/GiveNTech.git
cd GiveNTech

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate app key
node ace generate:key

# Create database
mysql -u root -p -e "CREATE DATABASE giventech;"

# Run migrations
node ace migration:run

# Start dev server (auto HMR)
npm run dev

# Access application
http://localhost:3333
```

---

## 🚦 Instalasi & Setup Lengkap

### Step 1: Clone Repository
```bash
git clone https://github.com/Areandra/GiveNTech.git
cd GiveNTech
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Copy Environment File
```bash
cp .env.example .env
```

### Step 4: Generate Application Key
```bash
node ace generate:key
```

Output akan seperti:
```
✔ APP_KEY has been generated: base64:xxxxxxxxxxxxxxxxxxxx
```

### Step 5: Create Database
```bash
# Login ke MySQL
mysql -u root -p

# Di dalam MySQL prompt:
CREATE DATABASE giventech;
EXIT;
```

### Step 6: Configure .env File
Edit file `.env` sesuai konfigurasi di section berikutnya.

### Step 7: Run Database Migrations
```bash
node ace migration:run
```

Output:
```
✔ Migrated:     database/migrations/xxxxx_create_users_table
✔ Migrated:     database/migrations/xxxxx_create_facilities_table
✔ Migrated:     database/migrations/xxxxx_create_rooms_table
✔ Migrated:     database/migrations/xxxxx_create_bookings_table
✔ Completed:    4 migrations
```

### Step 8: Start Development Server
```bash
npm run dev
```

Access di browser: **http://localhost:3333**

---

## 🔐 Environment Configuration Lengkap

Copy `.env.example` ke `.env` dan konfigurasi semua variable di bawah:

```env
# ============================================
# 🌍 APPLICATION & SERVER CONFIGURATION
# ============================================
NODE_ENV=development
PORT=3333
HOST=localhost
LOG_LEVEL=info
TZ=UTC

# ============================================
# 🔑 APPLICATION KEY (Generate dengan: node ace generate:key)
# ============================================
APP_KEY=base64:xxxxxxxxxxxxxxxxxxxx

# ============================================
# 🗄️ DATABASE CONFIGURATION (MySQL/MariaDB)
# ============================================
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=giventech

# ============================================
# 📦 SESSION CONFIGURATION
# ============================================
SESSION_DRIVER=cookie

# ============================================
# 💾 REDIS CONFIGURATION (Optional untuk OTP)
# ============================================
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# ============================================
# 🌐 GOOGLE OAUTH 2.0 (Opsional)
# ============================================
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_xxxx

# ============================================
# 📧 SMTP EMAIL CONFIGURATION
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password

# ============================================
# 📱 WHATSAPP CLOUD API
# ============================================
PHONE_NUMBER_ID=your_phone_number_id
WA_ACCESS_TOKEN=your_access_token_xxxx
```

### Penjelasan Setiap Variable

#### **Application & Server**
```env
NODE_ENV=development    # environment: development/production/test
PORT=3333              # port aplikasi AdonisJS berjalan
HOST=localhost         # hostname: localhost (dev) atau IP (production)
LOG_LEVEL=info         # log level: debug/info/warn/error
TZ=UTC                 # timezone: UTC/Asia/Jakarta
APP_KEY=               # Generate dengan: node ace generate:key
```

#### **Database Configuration**
```env
DB_CONNECTION=mysql    # database connection type
DB_HOST=127.0.0.1      # MySQL host (localhost atau IP server)
DB_PORT=3306           # MySQL port (default: 3306)
DB_USER=root           # MySQL username
DB_PASSWORD=           # MySQL password (kosong jika tidak ada)
DB_DATABASE=giventech  # Nama database (harus dibuat manual sebelum migration)
```

**⚠️ PENTING:**
- Buat database `giventech` secara manual sebelum run migration
- Jika password berisi special character, gunakan quote: `DB_PASSWORD="pass@123"`

#### **Redis Configuration (Optional)**
```env
REDIS_HOST=127.0.0.1   # Redis host
REDIS_PORT=6379        # Redis port (default: 6379)
REDIS_PASSWORD=        # Redis password (kosong jika tidak ada)
```

**⚠️ PENTING:**
- Redis optional, sistem tetap berjalan tanpa Redis
- Jika ingin gunakan Redis untuk OTP, pastikan Redis running terlebih dahulu

#### **Session Configuration**
```env
SESSION_DRIVER=cookie  # session driver: cookie/memory/redis
```

#### **Google OAuth 2.0 (Opsional)**
Untuk setup login dengan Google:

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru
3. Enable Google+ API
4. Buat OAuth 2.0 credentials (Web Application)
5. Set Authorized redirect URIs:
   - `http://localhost:3333/oauth/google/token/callback`
   - `https://yourdomain.com/oauth/google/token/callback` (production)
6. Copy `Client ID` dan `Client Secret`

#### **SMTP Email Configuration**
Untuk send email (opsional):

**Gmail Setup:**
1. Buka [Google Account](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Generate "App Password"
4. Copy app password 16 character

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # 16 character app password
```

**Atau gunakan provider lain:**
- **Outlook**: `smtp.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom**: `mail.yourdomain.com:587`

#### **WhatsApp Cloud API (Opsional)**
Untuk notifikasi WhatsApp:

1. Setup Business Account di Facebook
2. Daftarkan nomor WhatsApp
3. Generate access token
4. Dapatkan Phone Number ID

[Referensi Setup](https://developers.facebook.com/docs/whatsapp/cloud-api)

---

## 👥 Fitur & Role System

### Role Permissions

| Fitur | Admin | Approver | User |
|-------|-------|----------|------|
| View Dashboard | ✅ | ❌ | ✅ |
| Kelola Fasilitas | ✅ | ❌ | ❌ |
| Kelola Ruangan | ✅ | ❌ | ❌ |
| View Semua Booking | ✅ | ✅ | ❌ |
| Approve Booking | ✅ | ✅ | ❌ |
| Buat Booking | ✅ | ❌ | ✅ |
| Lihat Own Booking | ✅ | ❌ | ✅ |
| Scan QR | ✅ | ❌ | ❌ |
| Lihat Analytics | ✅ | ❌ | ❌ |

### Admin Dashboard Routes
```
/dashboard              - Admin dashboard dengan statistik
/booking                - Lihat & manage semua booking
/booking/:id/edit       - Edit booking status
/facilities             - CRUD fasilitas
/facilities/create      - Buat fasilitas baru
/facilities/:id/edit    - Edit fasilitas
/qrScanner              - Scan QR untuk pickup/return
/map                    - Lihat lokasi ruangan
/room                   - CRUD ruangan
/room/create            - Buat ruangan baru
/room/:id/edit          - Edit ruangan
```

### User Portal Routes
```
/user/dashboard              - User dashboard
/user/facilities             - Browse fasilitas
/booking/create/:facilityId  - Buat booking
/user/booking/history        - History peminjaman
/booking/:id                 - Detail booking
/booking/:id/qr              - Download QR code
```

---

## 🔄 Alur Penggunaan Lengkap

### User Flow (Peminjam)

```
1. REGISTER & LOGIN
   ├─ Register di /register
   ├─ Input email, password, username
   ├─ Verify OTP (jika Redis enabled)
   └─ Login di /login

2. BROWSE FASILITAS
   ├─ Akses /user/facilities
   ├─ Lihat list fasilitas available
   ├─ Filter by status
   └─ Klik untuk detail

3. BUAT BOOKING
   ├─ Klik "Booking Fasilitas"
   ├─ Form: tanggal, ruangan (map), tujuan, catatan
   ├─ Review detail
   ├─ Submit
   └─ Status: Pending

4. TUNGGU APPROVAL
   ├─ Dashboard /user/dashboard
   ├─ Lihat status: "Pending"
   ├─ Terima WhatsApp notifikasi
   └─ Admin approve → Status: Confirmed

5. PICKUP BARANG
   ├─ Akses /booking/:id/qr
   ├─ Lihat/download QR code
   ├─ Bawa ke tempat pengambilan
   ├─ Admin scan QR
   └─ Status: Picked Up

6. GUNAKAN FASILITAS
   ├─ Gunakan sesuai durasi booking
   └─ Jaga kondisi barang

7. RETURN BARANG
   ├─ Kembalikan ke tempat asal
   ├─ Admin scan QR
   ├─ Check kondisi:
   │  ├─ OK → Status: Returned → Done ✅
   │  └─ Rusak → Status: Penalized
   └─ Terima WhatsApp notifikasi

8. LIHAT HISTORY
   ├─ Akses /user/booking/history
   └─ Lihat semua peminjaman selesai
```

### Admin Flow (Approval & Management)

```
1. LOGIN
   ├─ Login ke /login
   ├─ Role: admin
   └─ Redirect ke /dashboard

2. VIEW DASHBOARD
   ├─ Lihat statistik:
   │  ├─ Total booking hari ini
   │  ├─ Total user terdaftar
   │  ├─ Fasilitas rusak
   │  └─ Grafik 7 hari terakhir
   └─ Lihat pending bookings

3. KELOLA FASILITAS
   ├─ Akses /facilities
   ├─ Create: Nama, tipe, status
   ├─ Update: Edit status, info
   └─ Delete: Hapus fasilitas

4. KELOLA RUANGAN
   ├─ Akses /room
   ├─ Create: Nama, latitude, longitude
   ├─ Update: Edit nama & koordinat
   └─ Delete: Hapus ruangan

5. APPROVE BOOKING
   ├─ Akses /booking
   ├─ Lihat pending requests
   ├─ Review: User, fasilitas, tanggal
   ├─ Action:
   │  ├─ APPROVE → Status: Confirmed
   │  └─ REJECT → Status: Cancelled
   └─ User dapat WhatsApp notifi

6. QR SCANNING
   ├─ Akses /qrScanner
   ├─ Saat pickup:
   │  └─ Scan QR → Status: Picked Up
   ├─ Saat return:
   │  ├─ Check kondisi barang
   │  └─ Scan QR → Status: Returned/Penalized
   └─ Database update otomatis

7. VIEW MAP
   ├─ Akses /map
   ├─ Lihat lokasi semua ruangan
   ├─ Zoom & pan untuk detail
   └─ Lihat mana ruangan sedang dipakai

8. ANALYTICS & REPORT
   ├─ Lihat dashboard
   ├─ Grafik booking trend
   ├─ Fasilitas rusak breakdown
   └─ User growth
```

---

## 🔑 OTP & Redis Management

### OTP Flow

```
User Register
    ↓
Generate 6-digit OTP
    ↓
Store di Redis:
  Key: "otp:user_email"
  Value: "123456"
  TTL: 300 detik (5 menit)
    ↓
Send OTP via Email
    ↓
User Input OTP
    ↓
Verify dengan Redis
  - Get value "otp:user_email"
  - Compare dengan user input
  - Delete key jika match ✅
    ↓
Account Verified
```

### Redis Setup (Optional)

#### **Windows**
```bash
# Download: https://github.com/microsoftarchive/redis/releases
# Extract & jalankan redis-server.exe
# Atau gunakan WSL:
wsl
sudo apt-get install redis-server
redis-server
```

#### **Linux**
```bash
sudo apt-get update
sudo apt-get install redis-server
redis-server
```

#### **macOS**
```bash
brew install redis
redis-server
```

#### **Docker**
```bash
docker run -d -p 6379:6379 redis:latest
redis-cli ping  # Test
```

### Verify Redis Connection
```bash
redis-cli ping
# Output: PONG ✅
```

---

## 🔌 API Routes Lengkap

#### **Api Doscs** ####
```http
GET  /docs                    # Docs page
```

### Web Routes (Session-based, Inertia.js)

#### **Authentication**
```http
GET  /login                    # Login page
POST /login                    # Login submit
GET  /register                 # Register page
POST /register                 # Register submit
GET  /verify-otp               # Verify OTP page
POST /verify-otp               # Verify OTP submit
POST /logout                   # Logout
GET  /forgot-password          # Forgot password page
POST /forgot-password          # Send reset link
```

#### **Google OAuth**
```http
GET  /login/oauth/google                # Redirect ke Google
GET  /login/oauth/google/callback       # Callback dari Google
GET  /oauth/google/token                # Get token
GET  /oauth/google/token/callback       # Token callback
```

#### **Admin Routes** (auth + role: admin)
```http
GET  /dashboard                         # Admin dashboard
GET  /booking                           # List semua booking
GET  /booking/:bookingId/edit           # Edit booking
GET  /facilities                        # List fasilitas
GET  /facilities/create                 # Create form
GET  /facilities/:id/edit                # Edit form
GET  /qrScanner                         # QR scanner page
GET  /map                               # Map page
GET  /room                              # List ruangan
GET  /room/create                       # Create form
GET  /room/:id/edit                      # Edit form
```

#### **User Routes** (auth + role: user)
```http
GET  /user/dashboard                    # User dashboard
GET  /user/facilities                   # Browse fasilitas
GET  /user/booking/history              # History
GET  /booking/create/:facilityId        # Booking form
```

#### **Shared Routes** (auth)
```http
GET  /booking/:id/qr                    # View QR
GET  /booking/:id                       # Detail booking
```

### REST API Routes

#### **Auth API**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "api_token_xxx",
  "data": { user object }
}
```

#### **Facilities API**
```http
POST   /api/facility                 # Create
PATCH  /api/facility/:id             # Update
DELETE /api/facility/:id             # Delete
```

#### **Bookings API**
```http
GET    /api/bookings                 # List all (admin)
GET    /api/me/bookings              # My bookings (user)
POST   /api/bookings                 # Create
PATCH  /api/bookings/:id             # Update status
DELETE /api/bookings/:id             # Cancel
GET    /api/me/bookings/:id          # Detail my booking
```

#### **Users API**
```http
GET    /api/users                    # List all
GET    /api/users/:id                # Get user
POST   /api/users                    # Create
PATCH  /api/users/:id                # Update
DELETE /api/users/:id                # Delete
GET    /api/me                       # Current user profile
```

#### **Rooms API**
```http
GET    /api/rooms                    # List all
GET    /api/rooms/:id                # Get room
POST   /api/rooms                    # Create
PATCH  /api/rooms/:id                # Update
DELETE /api/rooms/:id                # Delete
```

---

## 📊 GraphQL Endpoint

```
POST /graphql
```

### Sample GraphQL Queries

```graphql
query {
  users {
    id
    username
    email
    role
    bookings { id status }
  }
}

query {
  facilities {
    id
    name
    type
    status
    bookings { id status }
  }
}

query {
  booking(id: 1) {
    id
    bookingDate
    returnDate
    status
    purpose
    user { username email }
    fasilitas { name type }
    rooms { roomName latitude longitude }
  }
}

query {
  rooms {
    id
    roomName
    latitude
    longitude
    bookings { id status }
  }
}
```

### Swagger/OpenAPI Documentation
```
GET /docs        # Swagger UI
GET /docs.json   # OpenAPI spec (JSON)
GET /docs.yaml   # OpenAPI spec (YAML)
```

---

## 💻 Developer Commands

### Development
```bash
npm run dev              # Start dev server (HMR enabled)
npm run dev:watch       # Watch mode
```

### Production
```bash
npm run build            # Build untuk production
npm start                # Start production server (node bin/server.js)
```

### Code Quality
```bash
npm run lint             # Check code style (ESLint)
npm run format           # Format code (Prettier)
npm run typecheck        # TypeScript type checking
```

### Testing
```bash
npm run test             # Run unit tests
npm run test:watch       # Watch mode
```

### Database
```bash
node ace migration:run           # Run migrations
node ace migration:rollback      # Rollback
node ace migration:refresh       # Refresh (DELETE DATA!)
node ace migration:status        # Check status
node ace seed:run                # Run seeders (jika ada)
```

### Utilities
```bash
node ace generate:key            # Generate APP_KEY
node ace list:routes             # List all routes
node ace generate:manifest       # Generate TypeScript manifest
```

---

## 📂 Project Structure

```
GiveNTech/
│
├── app/
│   ├── controllers/
│   │   ├── auth_controller.ts             # Auth, Login, Register, OAuth
│   │   ├── bookings_controller.ts         # Booking API
│   │   ├── fasilities_controller.ts       # Facility API
│   │   ├── rooms_controller.ts            # Room API
│   │   ├── users_controller.ts            # User API
│   │   ├── us_controller.ts                # Current user endpoints
│   │   └── views_controller.ts            # Page rendering
│   │
│   ├── models/
│   │   ├── user.ts                        # User model (auth mixin)
│   │   ├── booking.ts                     # Booking model
│   │   ├── facility.ts                    # Facility model
│   │   └── room.ts                        # Room model (geo-location)
│   │
│   ├── services/
│   │   ├── booking_service.ts             # Booking business logic
│   │   ├── facility_service.ts            # Facility logic
│   │   ├── user_service.ts                # User logic
│   │   ├── qr_code_service.ts             # QR generation & verify
│   │   ├── web_socket_service.ts          # Socket.IO real-time
│   │   └── whatsapp_cloud_api_service.ts  # WhatsApp integration
│   │
│   ├── validators/
│   │   ├── booking.ts
│   │   ├── facility.ts
│   │   ├── room.ts
│   │   ├── user.ts
│   │   └── global_error.ts
│   │
│   ├── middleware/
│   │   ├── auth_middleware.ts
│   │   ├── guest_middleware.ts
│   │   ├── role_based_acsess_middleware.ts
│   │   ├── container_bindings_middleware.ts
│   │   └── graph_ql_auth_middleware.ts
│   │
│   ├── exceptions/
│   │   └── handler.ts
│   │
│   └── graphql/
│       └── resolvers/
│           ├── booking_resolver.ts
│           ├── facility_resolver.ts
│           ├── room_resolver.ts
│           └── user_resolver.ts
│
├── inertia/
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── dashboard.tsx
│   │   │   ├── booking.tsx
│   │   │   ├── facility/
│   │   │   └── room/
│   │   ├── user/
│   │   │   ├── dashboard.tsx
│   │   │   ├── facilities.tsx
│   │   │   ├── history.tsx
│   │   │   └── booking/
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── forgot_password.tsx
│   │   └── shared/
│   │       ├── detail_booking.tsx
│   │       ├── booking_qr.tsx
│   │       ├── qr_reader.tsx
│   │       └── map.tsx
│   │
│   ├── components/
│   ├── layout/
│   ├── assets/
│   ├── types/
│   └── app.tsx
│
├── database/
│   └── migrations/
│       ├── create_users_table.ts
│       ├── create_facilities_table.ts
│       ├── create_rooms_table.ts
│       └── create_bookings_table.ts
│
├── config/
│   ├── database.ts
│   ├── auth.ts
│   ├── ally.ts
│   ├── session.ts
│   └── redis.ts
│
├── start/
│   ├── routes.ts                  # All routes
│   ├── kernel.ts                  # Middleware
│   ├── env.ts                     # Environment validation
│   ├── graphql.ts                 # GraphQL setup
│   └── ws.ts                      # WebSocket setup
│
├── tests/
│   ├── unit/
│   └── functional/
│
├── public/
├── resources/
├── .env.example                   # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── adonisrc.ts
└── README.md
```

---

## 🚨 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solutions:**
```bash
# Check MySQL running
mysql -u root -p -e "SELECT 1;"

# Check .env config
cat .env | grep DB_

# Create database manually
mysql -u root -p -e "CREATE DATABASE giventech;"
```

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solutions:**
```bash
# Check Redis running
redis-cli ping

# Start Redis
redis-server

# Or with Docker
docker run -d -p 6379:6379 redis:latest
```

### Port 3333 Already in Use
```
Error: listen EADDRINUSE :::3333
```

**Solutions:**
```bash
# Change port in .env
PORT=3334

# Or kill process
# Windows:
netstat -ano | findstr :3333
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3333
kill -9 <PID>
```

### Migration Failed
```
Error: Unknown column in field list
```

**Solutions:**
```bash
# Rollback
node ace migration:rollback
node ace migration:run

# Or refresh (DELETE ALL DATA!)
node ace migration:refresh
```

### WhatsApp API Not Sending
- Verify `PHONE_NUMBER_ID` & `WA_ACCESS_TOKEN`
- Ensure token is valid
- Check phone number format: `62812345678`
- Check internet connection
- View console logs for errors

### OTP Email Not Sending
- Verify SMTP config in `.env`
- Generate new Google App Password
- Enable "Less secure app access"
- Check email service status

### QR Code Error
```bash
# Install qrcode package
npm install qrcode

# Or reinstall
npm install
```

---

## 📚 Dokumentasi Referensi

| Teknologi | Link |
|-----------|------|
| **AdonisJS** | https://docs.adonisjs.com |
| **Lucid ORM** | https://lucid.adonisjs.com |
| **Inertia.js** | https://inertiajs.com |
| **React** | https://react.dev |
| **TypeScript** | https://www.typescriptlang.org |
| **GraphQL** | https://graphql.org |
| **Socket.IO** | https://socket.io |
| **Leaflet** | https://leafletjs.com |
| **WhatsApp API** | https://developers.facebook.com/docs/whatsapp/cloud-api |
| **Redis** | https://redis.io/docs |

---

## 🤝 Kontribusi & Lisensi

### Cara Berkontribusi

1. Fork repository
2. Clone fork Anda
3. Buat branch fitur: `git checkout -b feature/YourFeature`
4. Commit: `git commit -m 'Add YourFeature'`
5. Push: `git push origin feature/YourFeature`
6. Buat Pull Request

### Code Standards

```bash
npm run lint         # Pass linting
npm run format       # Pass formatting
npm run typecheck    # Pass type checking
npm run test         # Pass tests
```

---

## 📄 Lisensi

Project ini dilisensikan di bawah **MIT License**.

Anda bebas untuk:
- ✅ Menggunakan untuk project personal/komersial
- ✅ Memodifikasi dan redistribute
- ✅ Membuat karya derivative

Dengan syarat:
- ⚠️ Sertakan license notice
- ⚠️ Include original copyright

---

## 👤 Author & Contact

**Areandra**

- 🔗 GitHub: [@Areandra](https://github.com/Areandra)
- 💼 LinkedIn: [Muhammad Ariel](https://www.linkedin.com/in/muhammad-ariel-4899312a0/)
- 📧 Email: arielproject25@gmail.com

---

## 🐛 Issues & Support

- **Report Bug**: [GitHub Issues](https://github.com/Areandra/GiveNTech/issues)
- **Feature Request**: [GitHub Discussions](https://github.com/Areandra/GiveNTech/discussions)
- **Email**: arielproject25@gmail.com

---

<div align="center">

### Made with ❤️ by Areandra

**⭐ Jika project ini membantu, kasih STAR! ⭐**

[⬆ Back to Top](#-giventech---sistem-manajemen-peminjaman-fasilitas--barang-kampus)

</div>
