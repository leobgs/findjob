# 💼 Job Application Management Backend API

Spesifikasi teknis REST API backend untuk sistem manajemen lamaran pekerjaan (Job Application Management) yang mendukung dua peran utama: **Job Seeker** dan **Company**.

Dibangun dengan **TypeScript (strict mode)**, **Express.js**, **Prisma ORM**, dan **PostgreSQL**.

---

## 🛠️ Tech Stack

- **Runtime & Bahasa:** Node.js (v20+ LTS) & TypeScript
- **Framework:** Express.js
- **ORM & Database:** Prisma v6 & PostgreSQL
- **Validasi:** Zod (dengan `.strict()` pencegahan mass assignment)
- **Autentikasi & Keamanan:** JWT (`jsonwebtoken`), `bcrypt`, `helmet`, `cors`, `express-rate-limit`
- **Logging:** `morgan` dengan Request ID correlation (`X-Request-Id`)
- **Testing:** `vitest` + `supertest`
- **Dokumentasi API:** OpenAPI 3.0 YAML & Swagger UI (`/api/docs`)

---

## 🚀 Cara Setup dan Menjalankan

### 1. Prasyarat
- Node.js v20 atau lebih baru
- PostgreSQL aktif (contoh: port 5432)

### 2. Instalasi Dependensi
```bash
cd be
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi koneksi database:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/jobapp?schema=public
JWT_SECRET=super-secret-jwt-key-for-job-application-api-development-min-32-chars
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
```

### 4. Database Migration & Seeding
Jalankan migrasi schema dan populate data awal:
```bash
# Generate Prisma Client
npm run prisma:generate

# Jalankan migrasi
npm run prisma:migrate

# Jalankan seed data
npm run prisma:seed
```

### 5. Menjalankan Server
```bash
# Mode pengembangan dengan auto-reload
npm run dev

# Mode produksi (compile & run)
npm run build
npm start
```
Server akan aktif di `http://localhost:4000`.

---

## 👥 Kredensial Akun Seed Data

Database seed menyediakan akun siap pakai dengan password standar `Password123`:

| Role | Email | Password | Keterangan |
|---|---|---|---|
| **Job Seeker** | `seeker@test.com` | `Password123` | Budi Santoso |
| **Job Seeker** | `seeker2@test.com` | `Password123` | Siti Rahma |
| **Company** | `company@test.com` | `Password123` | Tech Corp (Admin) |
| **Company** | `company2@test.com` | `Password123` | Creative Studio (Admin) |

Seed juga memuat 8 lowongan pekerjaan bervariasi (Full-Time, Contract, Internship, Freelance) dan riwayat lamaran awal.

---

## 🧪 Menjalankan Automated Tests

Seluruh skenario fungsional dan aturan bisnis kritis diuji secara otomatis:
```bash
# Jalankan test suite sekali
npm test

# Mode watch saat koding
npm run test:watch
```

Cakupan pengujian mencakup 6 skenario kritis:
1. Register & login berhasil, password salah ditolak (401 generic message).
2. Endpoint Company ditolak untuk Job Seeker (403) dan unauthenticated (401).
3. Job Seeker melamar dua kali ke lowongan yang sama ditolak (409 Conflict).
4. Ownership check: Company A tidak bisa melihat kandidat atau mengubah status lamaran Company B (404).
5. Perubahan status mencatat riwayat kronologis lengkap (`fromStatus`, `toStatus`, `changedBy`, `note`).
6. Validasi Zod menolak format body/query/params yang tidak valid (400).

---

## 📚 Dokumentasi API

- **Interactive Swagger UI:** Akses langsung di browser pada [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **OpenAPI Specification:** Tersedia di file `openapi.yaml`
- **Markdown Documentation:** Tersedia di file `API.md`

---

## 📦 Skrip NPM

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan dengan `tsx watch` |
| `npm run build` | Mengompilasi TypeScript ke folder `dist/` |
| `npm start` | Menjalankan build hasil kompilasi produksi |
| `npm test` | Menjalankan suite pengujian dengan `vitest` |
| `npm run lint` | Memeriksa kepatuhan kode dengan `eslint` |
| `npm run prisma:migrate` | Membuat dan menerapkan migrasi skema database |
| `npm run prisma:seed` | Menjalankan skrip seed data idempotent |

