# Job Application Management Platform

Platform manajemen lowongan dan lamaran pekerjaan (Job Application Management System) yang menghubungkan Job Seeker (Pencari Kerja) dan Company (Perusahaan). Proyek ini dibangun sebagai solusi asesmen teknis Full Stack Developer di IndoKerja.id.

Aplikasi ini mengadopsi arsitektur Monorepo yang terdiri dari aplikasi Frontend (`/fe`) dan Backend REST API (`/be`).

---

## Daftar Isi

- [Tautan Demo dan Repository](#tautan-demo-dan-repository)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Akun Demo](#akun-demo)
- [Panduan Menjalankan Proyek](#panduan-menjalankan-proyek)
  - [Opsi 1: Menggunakan Docker Compose (Rekomendasi)](#opsi-1-menggunakan-docker-compose-rekomendasi)
  - [Opsi 2: Menjalankan Manual di Lokal (Node.js dan PostgreSQL)](#opsi-2-menjalankan-manual-di-lokal-nodejs-dan-postgresql)
- [Pengujian Otomatis (Automated Testing)](#pengujian-otomatis-automated-testing)
- [Dokumentasi API dan Testing via Postman](#dokumentasi-api-dan-testing-via-postman)
- [Struktur Direktori Monorepo](#struktur-direktori-monorepo)
- [Informasi Pengembang](#informasi-pengembang)

---

## Tautan Demo dan Repository

| Komponen                     | Lingkungan | URL / Tautan                                   |
| ---------------------------- | ---------- | ---------------------------------------------- |
| Frontend Web App             | Production | http://103.181.143.219                         |
| Backend REST API             | Production | http://103.181.143.219/api                     |
| Dokumentasi API (Swagger UI) | Production | http://103.181.143.219/api/docs                |
| Repository Utama (Monorepo)  | GitHub     | https://github.com/leobgs/findjob              |
| Direktori Frontend (`/fe`)   | GitHub     | https://github.com/leobgs/findjob/tree/main/fe |
| Direktori Backend (`/be`)    | GitHub     | https://github.com/leobgs/findjob/tree/main/be |

---

## Fitur Utama

### 1. Job Seeker (Pencari Kerja)

- Autentikasi dan Profil: Pendaftaran dan login akun Job Seeker dengan enkripsi kata sandi (bcrypt) dan token JWT.
- Eksplorasi Lowongan: Melihat daftar lowongan pekerjaan aktif (OPEN) lengkap dengan pencarian kata kunci, filter tipe pekerjaan (Full-Time, Contract, Internship, Freelance), dan pagination.
- Detail Lowongan: Informasi detail lowongan meliputi profil perusahaan, deskripsi pekerjaan, rentang gaji, dan lokasi.
- Melamar Pekerjaan: Pengajuan lamaran satu klik ke lowongan yang diminati.
- Pencegahan Lamaran Ganda (Anti-Duplicate): Validasi ganda pada tingkat service layer dan database constraint (`@unique([jobId, applicantId])`) yang mencegah seorang pencari kerja melamar ke lowongan yang sama lebih dari satu kali (menghasilkan status HTTP 409 Conflict).
- Dashboard Lamaran: Memantau daftar seluruh lamaran yang telah diajukan beserta status terbarunya (APPLIED, REVIEWING, SHORTLISTED, REJECTED, ACCEPTED).

### 2. Company (Perusahaan)

- Registrasi Perusahaan: Mendaftar akun perusahaan beserta data profil dan nama perusahaan.
- Manajemen Lowongan: Membuat posting lowongan pekerjaan baru dan mengelola lowongan milik sendiri.
- Manajemen Kandidat Pelamar: Melihat daftar kandidat yang melamar pada lowongan spesifik milik perusahaan.
- Update Status dan Audit Trail: Mengubah tahapan seleksi kandidat dengan catatan (note). Setiap perubahan status otomatis tercatat kronologis pada riwayat lamaran (Application History).
- Perlindungan Kepemilikan (Ownership Check): Perusahaan A tidak dapat melihat atau memodifikasi kandidat maupun lowongan milik Perusahaan B (HTTP 404 / 403).

### 3. Keamanan dan Arsitektur

- Role-Based Access Control (RBAC): Proteksi endpoint backend dan proteksi routing frontend sesuai peran pengguna.
- Validasi Skema Input Terpusat: Menggunakan Zod dengan opsi `.strict()` untuk mencegah mass assignment vulnerability.
- Format Respon Terstandarisasi: Format output konsisten untuk respon sukses maupun respon error terperinci lengkap dengan requestId.

---

## Tech Stack

| Komponen           | Teknologi                             | Keterangan                                               |
| ------------------ | ------------------------------------- | -------------------------------------------------------- |
| Frontend Framework | React 18, Vite, TypeScript            | SPA dengan TypeScript strict mode (bebas any)            |
| State dan Cache    | TanStack Query v5, Axios              | Pengelolaan server state dan sinkronisasi cache otomatis |
| UI dan Styling     | Tailwind CSS, Radix UI / shadcn/ui    | Desain modern, responsif, dan aksesibel                  |
| Form Handling      | React Hook Form, Zod                  | Validasi formulir di sisi klien                          |
| Backend Runtime    | Node.js (v20+ LTS), Express.js        | Arsitektur modular per fitur                             |
| Database dan ORM   | PostgreSQL 15, Prisma ORM v6          | Skema relasional dengan relasi dan indeks teroptimasi    |
| Keamanan           | JWT, Bcrypt, Helmet, CORS, Rate Limit | Proteksi header HTTP dan pembatasan brute-force          |
| Testing            | Vitest, Supertest                     | Pengujian integrasi alur bisnis kritis                   |
| Containerization   | Docker, Docker Compose, Nginx         | Multi-stage build produksi dan reverse proxy             |

---

## Akun Demo

Tersedia akun seed untuk langsung mencoba seluruh fungsionalitas aplikasi:

| Role           | Email             | Password    | Keterangan                                                |
| -------------- | ----------------- | ----------- | --------------------------------------------------------- |
| Job Seeker     | seeker@test.com   | Password123 | Budi Santoso (Mencari dan melamar pekerjaan)              |
| Job Seeker (2) | seeker2@test.com  | Password123 | Siti Rahma (Pengujian multi-pelamar)                      |
| Company        | company@test.com  | Password123 | Tech Corp (Posting lowongan dan kurasi pelamar)           |
| Company (2)    | company2@test.com | Password123 | Creative Studio (Uji isolasi data kepemilikan perusahaan) |

Catatan: Pada halaman login frontend, tersedia tombol Quick Demo untuk mengisi kredensial secara instan tanpa perlu mengetik manual.

---

## Panduan Menjalankan Proyek

Pilih salah satu metode di bawah ini:

---

### Opsi 1: Menggunakan Docker Compose

Metode ini akan otomatis mengonfigurasi dan menjalankan Database PostgreSQL, Backend API, dan Frontend (Nginx Reverse Proxy) dalam satu perintah.

#### Prasyarat:

- Docker dan Docker Compose telah terpasang di komputer.

#### Langkah-langkah:

1. Clone repositori:

   ```bash
   git clone https://github.com/leobgs/findjob.git
   cd findjob
   ```

2. Siapkan file environment:

   ```bash
   cp .env.example .env
   ```

3. Jalankan container:

   ```bash
   docker compose up -d --build
   ```

4. Jalankan migrasi skema database dan seed data di container:

   ```bash
   # Terapkan migrasi skema tabel
   docker compose exec server npx prisma migrate deploy

   # Masukkan data akun demo dan contoh lowongan
   docker compose exec server npm run prisma:seed
   ```

5. Akses aplikasi:
   - Frontend Web: http://localhost (Port 80)
   - Backend API: http://localhost:4000/api
   - Swagger API Documentation: http://localhost:4000/api/docs

6. Untuk menghentikan container:
   ```bash
   docker compose down
   ```

---

### Opsi 2: Menjalankan Manual di Lokal (Node.js dan PostgreSQL)

Gunakan metode ini untuk keperluan development dengan auto-reload (HMR / watch mode).

#### Prasyarat:

- Node.js v20 atau lebih baru
- PostgreSQL aktif pada port 5432

---

#### 1. Setup Backend (`/be`)

1. Masuk ke direktori backend dan pasang dependensi:

   ```bash
   cd be
   npm install
   ```

2. Buat file `.env` dari template:

   ```bash
   cp .env.example .env
   ```

   Sesuaikan `DATABASE_URL` dengan kredensial PostgreSQL lokal Anda:

   ```env
   PORT=4000
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:password@localhost:5432/jobapp?schema=public
   JWT_SECRET=super-secret-jwt-key-for-job-application-api-development-min-32-chars
   JWT_EXPIRES_IN=1d
   BCRYPT_SALT_ROUNDS=10
   CORS_ORIGIN=http://localhost:5173
   ```

3. Jalankan migrasi Prisma dan data seeder:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. Jalankan backend server:
   ```bash
   npm run dev
   ```
   Backend aktif pada: `http://localhost:4000`

---

#### 2. Setup Frontend (`/fe`)

1. Buka terminal baru, masuk ke direktori frontend, dan pasang dependensi:

   ```bash
   cd fe
   npm install
   ```

2. Buat file `.env` dari template:

   ```bash
   cp .env.example .env
   ```

   Pastikan konfigurasi API mengarah ke backend lokal:

   ```env
   VITE_API_URL=http://localhost:4000/api
   ```

3. Jalankan frontend development server:
   ```bash
   npm run dev
   ```
   Frontend aktif pada: `http://localhost:5173`

---

## Pengujian Otomatis (Automated Testing)

Backend dilengkapi test suite terintegrasi menggunakan Vitest dan Supertest untuk menguji logika bisnis utama:

```bash
cd be
npm test
```

### Skenario yang Diuji:

1. Autentikasi dan Keamanan: Registrasi user, login sukses, dan penolakan login dengan password salah (HTTP 401).
2. Role-Based Access Control: Endpoint Company menolak Job Seeker (HTTP 403) dan request unauthenticated (HTTP 401).
3. Anti-Duplicate Application: Penolakan lamaran ganda ke lowongan yang sama (HTTP 409 Conflict).
4. Ownership Protection: Company A tidak dapat melihat kandidat atau mengubah status lamaran pada lowongan Company B (HTTP 404 / 403).
5. Audit Trail: Pencatatan kronologis perubahan status lamaran (fromStatus, toStatus, changedBy, note).
6. Skema Validasi: Penolakan payload yang tidak sesuai aturan Zod (HTTP 400 Bad Request).

---

## Dokumentasi API dan Testing via Postman

### 1. Swagger UI Interaktif

Dokumentasi interaktif OpenAPI dapat diakses langsung melalui browser di:

- Production: https://nama-api.onrender.com/api/docs
- Lokal: http://localhost:4000/api/docs

### 2. Testing via Postman

Base URL:

- Production: `http://103.181.143.219/api/docs`
- Lokal: `http://localhost:4000/api`

#### Ringkasan Endpoint Utama:

| Method | Endpoint                      | Akses            | Deskripsi                                     |
| ------ | ----------------------------- | ---------------- | --------------------------------------------- |
| GET    | /api/health                   | Publik           | Health check status server                    |
| POST   | /api/auth/register            | Publik           | Registrasi Job Seeker atau Company            |
| POST   | /api/auth/login               | Publik           | Login pengguna dan mendapatkan token JWT      |
| GET    | /api/auth/me                  | Authenticated    | Profil user yang sedang login                 |
| GET    | /api/jobs                     | Authenticated    | Daftar lowongan aktif (filter dan pagination) |
| GET    | /api/jobs/:id                 | Authenticated    | Detail satu lowongan pekerjaan                |
| POST   | /api/jobs                     | Company          | Membuat lowongan baru                         |
| GET    | /api/jobs/mine                | Company          | Daftar lowongan milik perusahaan sendiri      |
| POST   | /api/jobs/:id/apply           | Job Seeker       | Melamar ke lowongan (anti-duplikasi 409)      |
| GET    | /api/jobs/:id/applications    | Company Pemilik  | Melihat daftar kandidat pelamar pada lowongan |
| GET    | /api/applications/mine        | Job Seeker       | Daftar riwayat lamaran milik pelamar          |
| PATCH  | /api/applications/:id/status  | Company Pemilik  | Mengubah status lamaran kandidat              |
| GET    | /api/applications/:id/history | Seeker / Company | Riwayat perubahan status lamaran              |

Catatan Autentikasi: Pada endpoint yang membutuhkan autentikasi, tambahkan header:  
`Authorization: Bearer <TOKEN_JWT_DARI_LOGIN>`

---

## Struktur Direktori Monorepo

```
findjob/
├── be/                       # Backend Application (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma     # Skema Database PostgreSQL
│   │   └── seed.ts           # Seeder Akun Demo dan Lowongan
│   ├── src/
│   │   ├── config/           # Konfigurasi Environment dan Database
│   │   ├── middlewares/      # Auth, Role, Validation, Error Handler
│   │   ├── modules/          # Modul Fitur (Auth, Jobs, Applications)
│   │   ├── app.ts            # Setup Express dan CORS
│   │   └── server.ts         # Server Entry Point
│   ├── tests/                # Automated Test Suite (Vitest)
│   ├── Dockerfile            # Multi-stage Dockerfile Backend
│   └── openapi.yaml          # Spesifikasi OpenAPI 3.0
├── fe/                       # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── api/              # Axios Client dan Query Keys
│   │   ├── components/       # Komponen UI (Navbar, Forms, Cards)
│   │   ├── contexts/         # Auth Context dan Provider
│   │   ├── hooks/            # Custom Hooks
│   │   ├── pages/            # Halaman (Jobs, Apply, Dashboard, Login)
│   │   └── types/            # TypeScript Definitions
│   ├── Dockerfile            # Multi-stage Dockerfile Frontend
│   └── nginx.conf            # Nginx Reverse Proxy Configuration
├── docker-compose.yml        # Orchestration (DB, Server, Client)
├── .env.example              # Template Environment Root Docker
└── README.md                 # Dokumentasi Utama Proyek
```

---
