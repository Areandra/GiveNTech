# 📚 GiveNTech - Campus Facility & Item Loan Management System

Modern facility/item loan management information system for campuses, organizations, and companies. Integrated with online booking, QR Code verification, approval workflow, room location tracking, and real-time notifications (WhatsApp Cloud API). Designed as a full-stack application with scalable and modular architecture using AdonisJS 6.

---

## 🎯 Quick Info

| Aspect | Detail |
| --- | --- |
| **Framework** | AdonisJS 6 (Full-Stack TypeScript) |
| **Frontend** | React 19 + InertiaJS |
| **Backend** | Node.js 20+ |
| **Database** | MySQL/MariaDB 10.4+ |
| **Cache/OTP** | Redis 6+ (Optional) |
| **API** | REST + GraphQL |
| **Realtime** | Socket.IO |
| **Maps** | Leaflet |
| **Notifications** | WhatsApp Cloud API |
| **Default Port** | 3333 |
| **Language** | TypeScript (99%), Other (1%) |

---

---

## 📖 Table of Contents

* [Overview](https://www.google.com/search?q=%23-overview)
* [Use Case & Target Audience](https://www.google.com/search?q=%23-use-case--target-audience)
* [Key Features](https://www.google.com/search?q=%23-key-features)
* [System Requirements](https://www.google.com/search?q=%23-system-requirements)
* [Quick Start](https://www.google.com/search?q=%23-quick-start)
* [Full Installation & Setup](https://www.google.com/search?q=%23-full-installation--setup)
* [Complete Environment Configuration](https://www.google.com/search?q=%23-complete-environment-configuration)
* [Features & Role System](https://www.google.com/search?q=%23-features--role-system)
* [Complete Usage Flow](https://www.google.com/search?q=%23-complete-usage-flow)
* [OTP & Redis Management](https://www.google.com/search?q=%23-otp--redis-management)
* [Complete API Routes](https://www.google.com/search?q=%23-complete-api-routes)
* [GraphQL Endpoint](https://www.google.com/search?q=%23-graphql-endpoint)
* [Developer Commands](https://www.google.com/search?q=%23-developer-commands)
* [Project Structure](https://www.google.com/search?q=%23-project-structure)
* [Troubleshooting](https://www.google.com/search?q=%23-troubleshooting)
* [Contribution & License](https://www.google.com/search?q=%23-contribution--license)

---

## 📋 Overview

**GiveNTech** is a campus facility/item loan management platform designed for:

✅ **Online Booking** - Users can book facilities in real-time
✅ **Approval Workflow** - Admins/Approvers can easily approve/reject requests
✅ **QR Code Verification** - Each booking has a unique QR for pickup/return tracking
✅ **Status Tracking** - Real-time tracking from Pending to Done
✅ **Location Tracking** - Each booking records which room is used (lat/long)
✅ **Map Display** - Leaflet map for room location visualization
✅ **WhatsApp Notifications** - Automatic approval notifications to user's WhatsApp
✅ **Dashboard Analytics** - Loan statistics, damaged facilities, charts
✅ **Dual API** - REST API + GraphQL for integration flexibility
✅ **Real-time Sync** - Socket.IO for live updates across devices
✅ **Role Management** - Admin, Approver, User with different permissions
✅ **Facility Management** - Complete CRUD for master data

---

## 🏫 Use Case & Target Audience

* 🏫 **University / School** - Management of classrooms, laboratories, equipment
* 🔬 **Laboratory** - Sharing equipment and lab tools
* 📚 **Library** - Book loans, study facilities, reading rooms
* 🏢 **Campus** - Halls, meeting rooms, office equipment
* 🏭 **Company** - Asset management, equipment rental
* 🚗 **Transportation** - Vehicle rental, transportation equipment

---

## ⭐ Key Features

### 1. **Booking System**

* Booking form with date picker
* Select room via map (Leaflet)
* Record loan purpose
* Approve/reject with notifications

### 2. **QR Code Verification**

* Unique QR per booking
* HMAC signature for security
* Scan at pickup & return
* Track real-time status

### 3. **Status Workflow**

```
Pending → Confirmed → Picked Up → Returned → Done
   (Approver approve)    (Scan QR)    (Scan QR)

```

### 4. **Location Tracking**

* Every booking records room location
* Latitude/Longitude for map
* Leaflet map display
* Loan history per room

### 5. **Role Management**

* **Admin** - Full access
* **Approver** - Approve booking
* **User** - Booking & track status

### 6. **Notifications**

* WhatsApp Cloud API
* Email notifications
* Socket.IO real-time updates

### 7. **Dashboard Analytics**

* 7-day booking chart
* Damaged facility statistics
* Total registered users
* Real-time availability status

### 8. **Facility Management**

* CRUD facility
* Status management (Available, Booked, Borrowed, Damaged, etc)
* Facility type classification

---

## ⚙️ System Requirements

### System Requirements

```
Node.js:       ≥ 20.x (LTS)       ✅ Tested: 20.11.0, 24.11.0
npm:           ≥ 10.x             ✅ Tested: 11.6.4
MySQL/MariaDB: ≥ 8.x / 10.4.32    ✅ Tested: MariaDB 10.4.32
Redis:         ≥ 6.x              ⚠️  Optional (for OTP)
OS:            Windows/Linux/Mac  ✅ Tested: Win 11, Ubuntu 24.04

```

### Development Tools (Recommended)

| Tool | Purpose | Link |
| --- | --- | --- |
| **VSCode** | Code Editor | [Download](https://code.visualstudio.com/) |
| **DBeaver** | Database GUI | [Download](https://dbeaver.io/) |
| **Postman** | API Testing | [Download](https://www.postman.com/) |
| **Git Bash** | Version Control | [Download](https://gitforwindows.org/) |
| **Docker** | Container (Optional) | [Download](https://www.docker.com/) |

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

## 🚦 Full Installation & Setup

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

Output will look like:

```
✔ APP_KEY has been generated: base64:xxxxxxxxxxxxxxxxxxxx

```

### Step 5: Create Database

```bash
# Login to MySQL
mysql -u root -p

# Inside MySQL prompt:
CREATE DATABASE giventech;
EXIT;

```

### Step 6: Configure .env File

Edit the `.env` file according to the configuration in the next section.

### Step 7: Run Database Migrations

```bash
node ace migration:run

```

Output:

```
✔ Migrated:      database/migrations/xxxxx_create_users_table
✔ Migrated:      database/migrations/xxxxx_create_facilities_table
✔ Migrated:      database/migrations/xxxxx_create_rooms_table
✔ Migrated:      database/migrations/xxxxx_create_bookings_table
✔ Completed:     4 migrations

```

### Step 8: Start Development Server

```bash
npm run dev

```

Access in browser: **http://localhost:3333**

---

## 🔐 Complete Environment Configuration

Copy `.env.example` to `.env` and configure all variables below:

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
# 🔑 APPLICATION KEY (Generate with: node ace generate:key)
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
# 💾 REDIS CONFIGURATION (Optional for OTP)
# ============================================
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# ============================================
# 🌐 GOOGLE OAUTH 2.0 (Optional)
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

### Explanation of Each Variable

#### **Application & Server**

```env
NODE_ENV=development    # environment: development/production/test
PORT=3333               # application port
HOST=localhost          # hostname: localhost (dev) or IP (production)
LOG_LEVEL=info          # log level: debug/info/warn/error
TZ=UTC                  # timezone: UTC/Asia/Jakarta
APP_KEY=                # Generate with: node ace generate:key

```

#### **Database Configuration**

```env
DB_CONNECTION=mysql    # database connection type
DB_HOST=127.0.0.1      # MySQL host (localhost or server IP)
DB_PORT=3306           # MySQL port (default: 3306)
DB_USER=root           # MySQL username
DB_PASSWORD=           # MySQL password (empty if none)
DB_DATABASE=giventech  # Database name (must be created manually before migration)

```

**⚠️ IMPORTANT:**

* Create the `giventech` database manually before running migrations.
* If the password contains special characters, use quotes: `DB_PASSWORD="pass@123"`

#### **Redis Configuration (Optional)**

```env
REDIS_HOST=127.0.0.1   # Redis host
REDIS_PORT=6379        # Redis port (default: 6379)
REDIS_PASSWORD=        # Redis password (empty if none)

```

**⚠️ IMPORTANT:**

* Redis is optional; the system will run without it.
* If you want to use Redis for OTP, ensure Redis is running first.

#### **Session Configuration**

```env
SESSION_DRIVER=cookie  # session driver: cookie/memory/redis

```

#### **Google OAuth 2.0 (Optional)**

To setup login with Google:

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Set Authorized redirect URIs:
* `http://localhost:3333/oauth/google/token/callback`
* `https://yourdomain.com/oauth/google/token/callback` (production)


6. Copy `Client ID` and `Client Secret`

#### **SMTP Email Configuration**

To send email (optional):

**Gmail Setup:**

1. Open [Google Account](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Generate "App Password"
4. Copy the 16-character app password

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # 16 character app password

```

**Or use another provider:**

* **Outlook**: `smtp.outlook.com:587`
* **Yahoo**: `smtp.mail.yahoo.com:587`
* **Custom**: `mail.yourdomain.com:587`

#### **WhatsApp Cloud API (Optional)**

For WhatsApp notifications:

1. Setup Business Account on Facebook
2. Register WhatsApp number
3. Generate access token
4. Get Phone Number ID

[Setup Reference](https://developers.facebook.com/docs/whatsapp/cloud-api)

---

## 👥 Features & Role System

### Role Permissions

| Feature | Admin | Approver | User |
| --- | --- | --- | --- |
| View Dashboard | ✅ | ❌ | ✅ |
| Manage Facilities | ✅ | ❌ | ❌ |
| Manage Rooms | ✅ | ❌ | ❌ |
| View All Bookings | ✅ | ✅ | ❌ |
| Approve Booking | ✅ | ✅ | ❌ |
| Create Booking | ✅ | ❌ | ✅ |
| View Own Booking | ✅ | ❌ | ✅ |
| Scan QR | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ❌ | ❌ |

### Admin Dashboard Routes

```
/dashboard              - Admin dashboard with statistics
/booking                - View & manage all bookings
/booking/:id/edit       - Edit booking status
/facilities             - CRUD facilities
/facilities/create      - Create new facility
/facilities/:id/edit    - Edit facility
/qrScanner              - Scan QR for pickup/return
/map                    - View room locations
/room                   - CRUD rooms
/room/create            - Create new room
/room/:id/edit          - Edit room

```

### User Portal Routes

```
/user/dashboard              - User dashboard
/user/facilities             - Browse facilities
/booking/create/:facilityId  - Create booking
/user/booking/history        - Loan history
/booking/:id                 - Booking detail
/booking/:id/qr              - Download QR code

```

---

## 🔄 Complete Usage Flow

### User Flow (Borrower)

```
1. REGISTER & LOGIN
   ├─ Register at /register
   ├─ Input email, password, username
   ├─ Verify OTP (if Redis enabled)
   └─ Login at /login

2. BROWSE FACILITIES
   ├─ Access /user/facilities
   ├─ View list of available facilities
   ├─ Filter by status
   └─ Click for details

3. CREATE BOOKING
   ├─ Click "Book Facility"
   ├─ Form: date, room (map), purpose, notes
   ├─ Review details
   ├─ Submit
   └─ Status: Pending

4. WAIT FOR APPROVAL
   ├─ Dashboard /user/dashboard
   ├─ View status: "Pending"
   ├─ Receive WhatsApp notification
   └─ Admin approve → Status: Confirmed

5. PICKUP ITEM
   ├─ Access /booking/:id/qr
   ├─ View/download QR code
   ├─ Bring to pickup location
   ├─ Admin scans QR
   └─ Status: Picked Up

6. USE FACILITY
   ├─ Use according to booking duration
   └─ Maintain item condition

7. RETURN ITEM
   ├─ Return to original place
   ├─ Admin scans QR
   ├─ Check condition:
   │  ├─ OK → Status: Returned → Done ✅
   │  └─ Damaged → Status: Penalized
   └─ Receive WhatsApp notification

8. VIEW HISTORY
   ├─ Access /user/booking/history
   └─ View all completed loans

```

### Admin Flow (Approval & Management)

```
1. LOGIN
   ├─ Login to /login
   ├─ Role: admin
   └─ Redirect to /dashboard

2. VIEW DASHBOARD
   ├─ View statistics:
   │  ├─ Total bookings today
   │  ├─ Total registered users
   │  ├─ Damaged facilities
   │  └─ Last 7 days chart
   └─ View pending bookings

3. MANAGE FACILITIES
   ├─ Access /facilities
   ├─ Create: Name, type, status
   ├─ Update: Edit status, info
   └─ Delete: Remove facility

4. MANAGE ROOMS
   ├─ Access /room
   ├─ Create: Name, latitude, longitude
   ├─ Update: Edit name & coordinates
   └─ Delete: Remove room

5. APPROVE BOOKING
   ├─ Access /booking
   ├─ View pending requests
   ├─ Review: User, facility, date
   ├─ Action:
   │  ├─ APPROVE → Status: Confirmed
   │  └─ REJECT → Status: Cancelled
   └─ User receives WhatsApp notification

6. QR SCANNING
   ├─ Access /qrScanner
   ├─ At pickup:
   │  └─ Scan QR → Status: Picked Up
   ├─ At return:
   │  ├─ Check item condition
   │  └─ Scan QR → Status: Returned/Penalized
   └─ Database updates automatically

7. VIEW MAP
   ├─ Access /map
   ├─ View location of all rooms
   ├─ Zoom & pan for details
   └─ See which rooms are currently in use

8. ANALYTICS & REPORT
   ├─ View dashboard
   ├─ Booking trend chart
   ├─ Damaged facilities breakdown
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
Store in Redis:
  Key: "otp:user_email"
  Value: "123456"
  TTL: 300 seconds (5 minutes)
    ↓
Send OTP via Email
    ↓
User Input OTP
    ↓
Verify with Redis
  - Get value "otp:user_email"
  - Compare with user input
  - Delete key if match ✅
    ↓
Account Verified

```

### Redis Setup (Optional)

#### **Windows**

```bash
# Download: https://github.com/microsoftarchive/redis/releases
# Extract & run redis-server.exe
# Or use WSL:
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

## 🔌 Complete API Routes

#### **Api Docs**

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
GET  /login/oauth/google                 # Redirect to Google
GET  /login/oauth/google/callback        # Callback from Google
GET  /oauth/google/token                 # Get token
GET  /oauth/google/token/callback        # Token callback

```

#### **Admin Routes** (auth + role: admin)

```http
GET  /dashboard                         # Admin dashboard
GET  /booking                           # List all bookings
GET  /booking/:bookingId/edit           # Edit booking
GET  /facilities                        # List facilities
GET  /facilities/create                 # Create form
GET  /facilities/:id/edit               # Edit form
GET  /qrScanner                         # QR scanner page
GET  /map                               # Map page
GET  /room                              # List rooms
GET  /room/create                       # Create form
GET  /room/:id/edit                     # Edit form

```

#### **User Routes** (auth + role: user)

```http
GET  /user/dashboard                    # User dashboard
GET  /user/facilities                   # Browse facilities
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
npm run dev:watch        # Watch mode

```

### Production

```bash
npm run build            # Build for production
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
node ace seed:run                # Run seeders (if any)

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
│   │   ├── us_controller.ts               # Current user endpoints
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

* Verify `PHONE_NUMBER_ID` & `WA_ACCESS_TOKEN`
* Ensure token is valid
* Check phone number format: `62812345678`
* Check internet connection
* View console logs for errors

### OTP Email Not Sending

* Verify SMTP config in `.env`
* Generate new Google App Password
* Enable "Less secure app access"
* Check email service status

### QR Code Error

```bash
# Install qrcode package
npm install qrcode

# Or reinstall
npm install

```

---

## 📚 Reference Documentation

| Technology | Link |
| --- | --- |
| **AdonisJS** | [https://docs.adonisjs.com](https://docs.adonisjs.com) |
| **Lucid ORM** | [https://lucid.adonisjs.com](https://lucid.adonisjs.com) |
| **Inertia.js** | [https://inertiajs.com](https://inertiajs.com) |
| **React** | [https://react.dev](https://react.dev) |
| **TypeScript** | [https://www.typescriptlang.org](https://www.typescriptlang.org) |
| **GraphQL** | [https://graphql.org](https://graphql.org) |
| **Socket.IO** | [https://socket.io](https://socket.io) |
| **Leaflet** | [https://leafletjs.com](https://leafletjs.com) |
| **WhatsApp API** | [https://developers.facebook.com/docs/whatsapp/cloud-api](https://developers.facebook.com/docs/whatsapp/cloud-api) |
| **Redis** | [https://redis.io/docs](https://redis.io/docs) |

---

## 🤝 Contribution & License

### How to Contribute

1. Fork repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/YourFeature`
4. Commit: `git commit -m 'Add YourFeature'`
5. Push: `git push origin feature/YourFeature`
6. Create a Pull Request

### Code Standards

```bash
npm run lint         # Pass linting
npm run format       # Pass formatting
npm run typecheck    # Pass type checking
npm run test         # Pass tests

```

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to:

* ✅ Use for personal/commercial projects
* ✅ Modify and redistribute
* ✅ Create derivative works

Under the condition:

* ⚠️ Include license notice
* ⚠️ Include original copyright

---

## 👤 Author & Contact

**Areandra**

* 🔗 GitHub: [@Areandra](https://github.com/Areandra)
* 💼 LinkedIn: [Muhammad Ariel](https://www.linkedin.com/in/muhammad-ariel-4899312a0/)
* 📧 Email: muhammadariel2207gmail.com

---

## 🐛 Issues & Support

* **Report Bug**: [GitHub Issues](https://github.com/Areandra/GiveNTech/issues)
* **Feature Request**: [GitHub Discussions](https://github.com/Areandra/GiveNTech/discussions)
* **Email**: muhammadariel2207gmail.com

---

<div align="center">

### Made with ❤️ by Areandra

**⭐ If this project helps you, give it a STAR! ⭐**

[⬆ Back to Top](https://www.google.com/search?q=%23-giventech---campus-facility--item-loan-management-system)

</div>
