# 🌐 Indokerja - Frontend Application

Aplikasi antarmuka web modern untuk platform manajemen lamaran pekerjaan (**Job Application Management**) yang mendukung dua peran pengguna: **Job Seeker** (Pencari Kerja) dan **Company** (Perusahaan).

Dibangun menggunakan **React 18**, **TypeScript (Strict Mode)**, **Vite**, **Tailwind CSS**, dan **TanStack Query**.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite (SPA)
- **Bahasa:** TypeScript (~5.6) dengan *strict mode* tanpa `any`
- **Routing:** React Router v6 dengan *Role-based Protected Routes*
- **Server State & Cache:** TanStack Query v5 + Axios
- **Form Management & Validasi:** React Hook Form + Zod
- **Styling:** Tailwind CSS + Desain token berbasis Radix/shadcn
- **Ikon:** Lucide React
- **Notifikasi Toast:** Sonner

---

## 🚀 Cara Menjalankan

### 1. Prasyarat
- Node.js (v20+ disarankan)
- Backend API aktif di `http://localhost:4000/api`

### 2. Instalasi Dependensi
```bash
cd fe
npm install
```

### 3. Konfigurasi Environment
Salin file `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi URL API:
```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:5173`.

### 5. Build Produksi
```bash
npm run build
npm run preview
```

---

## 👥 Akun Demo Siap Pakai

Tersedia tombol pengisian instan (*Quick Demo*) di halaman Login:

| Peran | Email | Kata Sandi | Keterangan |
|---|---|---|---|
| **Job Seeker** | `seeker@test.com` | `Password123` | Budi Santoso |
| **Job Seeker** | `seeker2@test.com` | `Password123` | Siti Rahma |
| **Company** | `company@test.com` | `Password123` | Tech Corp Admin |
| **Company** | `company2@test.com` | `Password123` | Creative Studio Admin |

---

## 📁 Struktur Proyek

```
fe/
├── src/
│   ├── api/                 # Axios instance, query key factory, & fungsi API
│   │   ├── client.ts
│   │   ├── queryKeys.ts
│   │   ├── auth.api.ts
│   │   ├── jobs.api.ts
│   │   └── applications.api.ts
│   ├── components/
│   │   ├── ui/              # Button, Input, Card, Dialog, Skeleton
│   │   ├── layout/          # Navbar, AppLayout
│   │   └── feedback/        # StatusBadge, EmptyState, ErrorState
│   ├── context/
│   │   └── AuthContext.tsx  # Autentikasi sesi & profil pengguna
│   ├── features/
│   │   ├── auth/            # Schema validasi form autentikasi
│   │   ├── jobs/            # JobCard & JobFilters
│   │   ├── applications/    # HistoryTimelineModal
│   │   └── company/         # StatusSelectDialog & JobSchema
│   ├── hooks/               # useJobs, useApplications
│   ├── pages/
│   │   ├── auth/            # LoginPage, RegisterPage
│   │   ├── jobs/            # JobsPage, JobDetailPage
│   │   ├── applications/    # MyApplicationsPage
│   │   ├── company/         # MyJobsPage, CreateJobPage, JobApplicantsPage
│   │   └── NotFoundPage.tsx # Halaman 404
│   ├── routes/
│   │   ├── index.tsx        # Konfigurasi routing
│   │   └── ProtectedRoute.tsx # Route guards
│   ├── types/               # Kontrak DTO TypeScript lengkap
│   ├── utils/               # Format mata uang rupiah, tanggal, status style
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
└── vite.config.ts
```

---

## ✨ Fitur Utama yang Telah Diimplementasikan

1. **Autentikasi & Otorisasi:**
   - Login & Register dengan validasi Zod ketat.
   - Pilihan peran interaktif saat registrasi (Job Seeker / Company).
   - *Protected Route* berbasis peran dengan auto-redirect jika akses tidak sah.
   - Penanganan token kedaluwarsa (401) otomatis membersihkan sesi dan mengarahkan ke login.

2. **Pengalaman Job Seeker:**
   - **Eksplor Lowongan:** Pencarian kata kunci, filter lokasi, filter tipe pekerjaan, dan pagination tanpa kedip (`keepPreviousData`).
   - **Detail Lowongan:** Informasi lengkap gaji, kualifikasi, deskripsi perusahaan.
   - **Melamar Pekerjaan:** Dialog konfirmasi melamar dengan status anti-duplikasi (tombol disabled jika sudah melamar).
   - **Riwayat Lamaran Saya:** Daftar seluruh lamaran yang telah diajukan beserta status warna standar (*Applied, Reviewing, Shortlisted, Accepted, Rejected*).
   - **Timeline Riwayat Status:** Modal interaktif yang menampilkan kronologi perpindahan status lamaran, siapa yang mengubah, dan catatan (*note*).

3. **Pengalaman Perusahaan (Company):**
   - **Kelola Lowongan Saya:** Daftar lowongan aktif perusahaan disertai jumlah kandidat pelamar (`applicantCount`).
   - **Publikasi Lowongan Baru:** Form lengkap dengan validasi rentang gaji (`salaryMax >= salaryMin`) dan deskripsi terperinci.
   - **Daftar Pelamar per Lowongan:** Tabel responsif (desktop) dan kartu (mobile) dengan filter status.
   - **Ubah Status Kandidat:** Dialog pemilihan status baru dengan kolom catatan opsional hingga 500 karakter.
   - **Audit Trail:** Riwayat status kandidat langsung dapat dipantau dari sisi perusahaan.

