# TaskList — Sistem Peminjaman Fasilitas Kampus 🏫📋

Deskripsi singkat
-----------------
GiveNTech adalah aplikasi full‑stack untuk manajemen peminjaman fasilitas kampus (ruang rapat, laboratorium, dsb.). Backend dibangun dengan AdonisJS + Lucid ORM, frontend menggunakan Inertia.js + React (TypeScript). Menyediakan panel Admin (manajemen pengguna, fasilitas, booking) dan panel User (daftar fasilitas, buat booking, profil).

Fitur utama
-----------
- Autentikasi (register, login, logout) 🔐
- OAuth Google (login via Google) 🌐
- Panel Admin
  - Dashboard ringkasan (users, fasilitas, booking)
  - CRUD fasilitas (tambah / edit / hapus)
  - Manajemen booking (ubah status, hapus)
  - Manajemen pengguna (lihat, update, provide/revoke peran)  
- Panel User
  - Dashboard & daftar booking
  - Daftar fasilitas dan modal peminjaman (pinjam)
  - Profil pengguna
- Validasi input dengan vine
- Migrations & seeders untuk inisialisasi data
- Tailwind CSS + lucide-react untuk UI

Teknologi utama
---------------
- AdonisJS (Backend, Auth, Lucid ORM)
- Inertia.js + React (TypeScript) untuk frontend
- Tailwind CSS untuk styling
- vine untuk validasi
- GraphQL provider tersedia (foadonis/graphql) — blueprint ada di konfigurasi
- Database: MySQL/Postgres/SQLite (sesuaikan .env)
- Tooling: Node.js, npm / pnpm / yarn

Instalasi & Setup (lokal)
-------------------------
1. Clone repo:
   git clone https://github.com/Areandra/TaskList.git
   cd TaskList

2. Install dependency:
   npm install
   (atau pnpm install / yarn install)

3. Salin file environment:
   cp .env.example .env
   - Isi variabel penting: APP_KEY, DB_CONNECTION, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, dsb.

4. Jalankan migrasi dan seeder:
   node ace migration:run
   node ace db:seed

5. Jalankan server development:
   npm run dev
   atau
   node ace serve --watch

6. Buka aplikasi di:
   http://localhost:3333 (default port AdonisJS)

Routes dan Dokumentasi API (disesuaikan dengan start/routes.ts)
---------------------------------------------------------------
Catatan: Semua route API diawali dengan prefix `/api` kecuali route auth (`/auth`) dan oauth (`/oauth`). Beberapa route membutuhkan autentikasi (`auth`) dan/atau role-based access (`admin`, `super_admin`).

Autentikasi & OAuth
```
- POST /auth/register
```
  - Deskripsi: Registrasi user baru.
  - Body JSON: ```{ "username","email","password" }```
  - Response: 201 Created { user, access_token }
  - Public
    
```
- POST /auth/login
```
  - Deskripsi: Login user.
  - Body JSON: ```{ "email", "password" }```
  - Response: 200 { user, access_token }
  - Public
    
```
- POST /auth/logout
```
  - Deskripsi: Logout (require Authorization header).
  - Header: Authorization: Bearer <token>
  - Response: 200 OK
    
```
- GET /oauth/google
```
  - Deskripsi: Redirect ke Google OAuth.
  - Public (frontend mengarahkan user)
    
```
- GET /oauth/google/callback
```
  - Deskripsi: Callback Google OAuth.

Frontend (Inertia) — halaman web (protected/role-based)

 - Protected: middleware.auth('frontend') dan roleBasedAcsess(['admin','super_admin'])
```
- GET /admin/dashboard
```
```
- GET /admin/booking
```
```
- GET /admin/users
```
```
- GET /admin/fasilitas
```
    
  - Protected: middleware.auth('frontend') dan roleBasedAcsess(['user'])
```
- GET /user/index
```
```
- GET /user/booking
```
```
- GET /user/fasilitas
```
```
- GET /user/profile
```
  

```
- GET /login -> renderInertia('auth/login')
```
```
- GET /register -> renderInertia('auth/register')
```

REST API (prefix /api)
- Routes yang hanya untuk admin / super_admin (role-based):
  ```
  - GET /api/users
  ```
    - Deskripsi: List pengguna (paginated).
    - Auth: Authorization: Bearer <token> + role admin|super_admin
    - Response: 200 { users: [...] }
    
  ```
  - POST /api/fasilitas
  ```
    - Deskripsi: Tambah fasilitas.
    - Auth: admin|super_admin
    - Body: ```{ "nama": "Ruang Rapat A" }```
    - Validasi: nama.required, maxLength 100
    - Response: 201 { data }
      
  ```
  - PUT /api/fasilitas/:id
  ```
    - Deskripsi: Update fasilitas.
    - Auth: admin|super_admin
    - Body: ```{ "nama": "Nama Baru", "status": "Perawatan" }```
    - Response: 200 { data }
      
  ```
  - DELETE /api/fasilitas/:id
  ```
    - Deskripsi: Hapus fasilitas.
    - Auth: admin|super_admin
    - Response: 200 / 204
      
  ```
  - PUT /api/bookings/:id
  ```
    - Deskripsi: Update booking (biasanya untuk ubah status).
    - Auth: admin|super_admin
    - Body: ```{ "status": "Disetujui" }```
    - Response: 200 { data }
      
  ```
  - DELETE /api/bookings/:id
  ```
    - Deskripsi: Hapus booking.
    - Auth: admin|super_admin
    - Response: 200 / 204

- Routes untuk user terautentikasi:
  ```
  - POST /api/bookings
  ```
    - Deskripsi: Buat booking (user).
    - Auth: bearer token
    - Body minimal (frontend memanggil):
      ```{ "id_fasilitas": 1, "no_ruang": "A101" }```
      Rekomendasi: tambahkan tgl_pinjam/tgl_kembali sesuai model backend:
      ```{ "id_fasilitas":1, "no_ruang":"A101", "tglPinjam":"2025-10-21", "tglKembali":"2025-10-22" }```
    - Response: 201 { message, data }
      
  ```
  - GET /api/fasilitas
  ```
    - Deskripsi: Daftar fasilitas (public atau auth required depending implementation).
    - Query optional: ?page=1, ?status=Tersedia
    - Response: 200 { data: [ {id,nama,status,created_at,...} ] }
      
  ```
  - GET /api/fasilitas/:id
  ```
    - Deskripsi: Detail fasilitas.
    - Response: 200 { data }
      
  ```
  - GET /api/bookings
  ```
    - Deskripsi: List booking (bisa filter user/status).
    - Response: 200 { data }
      
  ```
  - GET /api/bookings/:id
  ```
    - Deskripsi: Detail booking.
    - Response: 200 { data }

  - User profile routes (authenticated, some actions role-restricted):
    ```
    - GET /api/users/:username
    ```
      - Deskripsi: Ambil info user
      - Auth: bearer
        
    ```
    - PUT /api/users/:username
    ```
      - Deskripsi: Update user (profil)
      - Auth: bearer
        
    ```
    - GET /api/users/:username/provide
    ```
      - Deskripsi: Berikan role/permission (super_admin only)
      - Auth: super_admin
        
    ```
    - GET /api/users/:username/revoke
    ```
      - Deskripsi: Cabut role (super_admin only)
      - Auth: super_admin

Contoh request singkat (cURL)
- Login:
  ```bash
  curl -X POST https://your-host/auth/login -H "Content-Type: application/json" -d '{"email":"a@b.com","password":"pass"}'
  ```
- Get fasilitas (public):
  ```bash
  curl https://your-host/api/fasilitas
  ```
- Buat booking (authenticated):
  ```bash
  curl -X POST https://your-host/api/bookings \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"id_fasilitas":2,"no_ruang":"B201","tglPinjam":"2025-10-21","tglKembali":"2025-10-22"}'
  ```
GraphQL (update dokumentasi — berdasarkan schema & resolver di repo)
------------------------------------------------------------------
Catatan penting: repo ini sudah mendaftarkan provider GraphQL (@foadonis/graphql) dan mengimpor resolver berikut di `start/graphql.ts`:
- `app/graphql/resolvers/users_resolvers.ts`
- `app/graphql/resolvers/fasilitas_resolver.ts`
- `app/graphql/resolvers/bookings_resolvers.ts`

Konfigurasi GraphQL:
- Endpoint: `/graphql` (lihat `config/graphql.ts`)
- Playground & introspection: aktif pada environment non-production (lihat `config/graphql.ts`)
- File schema dihasilkan otomatis (`emitSchemaFile: true`)

Yang tersedia sekarang di GraphQL
- Hanya Query resolvers yang tersedia (tidak ada Mutation implementasi pada repo saat ini).
- Nama Query sesuai method resolver:
  - Users
  - User(id: Int!)
  - semuaFasilitas
  - fasilitas(id: Int!)
  - Bookings
  - Booking(id: Int!)

GraphQL SDL (representasi tipe berdasarkan models)
```graphql
type User {
  id: ID!
  username: String
  email: String
  role: String
  # relation: bookings: [Booking!]! -- resolvers use Lucid relation
}

type Fasilitas {
  id: ID!
  nama: String!
  status: String! # 'Tersedia' | 'Digunakan' | 'Perawatan' | 'Di Reservasi'
  createdAt: String
  updatedAt: String
}

type Booking {
  id: ID!
  id_user: Int!
  id_fasilitas: Int!
  no_ruang: String!
  tgl_pinjam: String
  tgl_kembali: String
  status: String! # 'Disetujui' | 'Dibatalkan' | 'Menunggu' | 'Dikembalikan' | 'Digunakan'
  createdAt: String
  updatedAt: String
}

type Query {
  Users: [User!]!
  User(id: Int!): User

  semuaFasilitas: [Fasilitas!]!
  fasilitas(id: Int!): Fasilitas

  Bookings: [Booking!]!
  Booking(id: Int!): Booking
}
```

Contoh Query & Penjelasan
- Ambil semua fasilitas:
```graphql
query {
  semuaFasilitas {
    id
    nama
    status
    createdAt
  }
}
```

- Ambil detail satu fasilitas:
```graphql
query {
  fasilitas(id: 2) {
    id
    nama
    status
    createdAt
    updatedAt
  }
}
```

- Ambil semua bookings:
```graphql
query {
  Bookings {
    id
    id_user
    id_fasilitas
    no_ruang
    tgl_pinjam
    tgl_kembali
    status
  }
}
```

- Ambil satu user:
```graphql
query {
  User(id: 1) {
    id
    username
    email
    role
  }
}
```

Catatan implementasi & behavior
- Query names: resolver method names digunakan langsung sebagai nama query (perhatikan huruf besar/kecil). Karena resolvers didefinisikan seperti `async Users()` atau `async semuaFasilitas()`, gunakan nama tersebut persis saat melakukan query.
- Resolvers saat ini hanya membaca data melalui Lucid models (no mutations). Jika Anda membutuhkan mutations (create/update/delete via GraphQL), perlu menambahkan resolver baru dan memperbarui schema/resolvers.
- Autentikasi: resolvers sekarang tidak menunjukkan middleware/auth di decorator; jika Anda ingin membatasi akses GraphQL untuk user terautentikasi, integrasikan middleware/auth di layer resolver atau di konfigurasi GraphQL server.

Cara mengakses GraphQL dari command-line (curl)
- Playground (web): buka http://localhost:3333/graphql (jika NODE_ENV !== production)
- Curl (query):
```bash
curl -X POST http://localhost:3333/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ semuaFasilitas { id nama status } }"}'
```

Ringkasan singkat
- Endpoint GraphQL: /graphql
- Query tersedia: Users, User(id), semuaFasilitas, fasilitas(id), Bookings, Booking(id)
- Saat ini hanya read-only (Queries). Untuk operasi mutasi, tambahkan resolver Mutation baru dan proteksi autentikasi sesuai kebutuhan.

Validasi & aturan bisnis (dari kode)
-----------------------------------
- Validator fasilitas: nama maksimal 100 karakter (app/validators/fasilita.ts)
- Status fasilitas merupakan enum: ['Tersedia', 'Digunakan', 'Perawatan', 'Di Reservasi']
- Frontend mencegah peminjaman bila status != 'Tersedia'
- Admin-only actions dilindungi oleh middleware roleBasedAcsess(['admin','super_admin'])
- Super admin untuk provide/revoke role.

Struktur folder utama
---------------------
```
- app/ ................... (controllers, models, validators)
  - controllers/
  - models/
  - validators/
- start/ .................. (routes.ts, kernel.ts, graphql bootstrap)
- inertia/ ................ (halaman React/Inertia)
  - app/Layouts
  - pages/
- database/
  - migrations/
  - seeders/
- public/
- config/
- package.json
- adonisrc.ts
```

Tips deploy
-----------
- Render: cocok untuk backend AdonisJS. Pastikan environment variables terpasang, jalankan migrasi & seeder saat first deploy.
- Vercel: jika ingin deploy frontend saja (pisahkan frontend), host backend di Render/Heroku.
- Pastikan APP_KEY dan konfigurasi DB di production sudah benar.

Testing
-------
- Project menyediakan konfigurasi Japa (tests/bootstrap.ts).
- Jalankan test: node bin/test.ts atau sesuai script di package.json.

Kontributor & Lisensi
---------------------
- Lisensi: MIT (default — ubah jika perlu)
- Maintainer: Areandra (pemilik repo)
- Contributor flow singkat:
  1. Fork → buat branch feature/...
  2. Jalankan migrasi/seeder & test
  3. Buka PR dengan deskripsi dan langkah reproduksi
