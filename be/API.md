# 📖 Job Application Management API Documentation

Base URL: `http://localhost:4000/api`
Interactive Swagger Docs: `http://localhost:4000/api/docs`

---

## 1. Format Respons Standar

### Sukses (Tanpa Pagination)
```json
{
  "success": true,
  "data": { ... }
}
```

### Sukses (Dengan Pagination)
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### Error
```json
{
  "success": false,
  "message": "Deskripsi kesalahan",
  "errors": [
    { "field": "email", "message": "Format email tidak valid" }
  ],
  "requestId": "b1c2d3e4-0000-0000-0000-000000000000"
}
```

---

## 2. Ringkasan Endpoint

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/api/health` | Publik | Health check status server |
| `POST` | `/api/auth/register` | Publik (Rate limited) | Registrasi Job Seeker atau Company |
| `POST` | `/api/auth/login` | Publik (Rate limited) | Login & perolehan token JWT |
| `GET` | `/api/auth/me` | Login | Mendapatkan profil pengguna login |
| `GET` | `/api/jobs` | Login | Daftar lowongan OPEN + pagination + filter |
| `GET` | `/api/jobs/mine` | Company | Lowongan milik perusahaan sendiri + applicantCount |
| `GET` | `/api/jobs/:id` | Login | Detail lowongan lengkap |
| `POST` | `/api/jobs` | Company | Membuat lowongan baru |
| `POST` | `/api/jobs/:id/apply` | Job Seeker | Melamar ke lowongan (anti-duplikat 409) |
| `GET` | `/api/jobs/:id/applications` | Company Pemilik | Daftar kandidat pelamar pada lowongan |
| `GET` | `/api/applications/mine` | Job Seeker | Riwayat lamaran milik sendiri |
| `PATCH` | `/api/applications/:id/status` | Company Pemilik | Mengubah status lamaran kandidat |
| `GET` | `/api/applications/:id/history` | Seeker/Company | Riwayat perubahan status kronologis |

---

## 3. Detail Endpoint

### 3.1 POST `/api/auth/register`
**Body:**
```json
{
  "name": "Budi Santoso",
  "email": "budi@test.com",
  "password": "Password123",
  "role": "JOB_SEEKER",
  "companyName": "Tech Corp" // wajib jika role: "COMPANY"
}
```
**Respons 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Budi Santoso",
      "email": "budi@test.com",
      "role": "JOB_SEEKER"
    },
    "token": "jwt-token-string"
  }
}
```

### 3.2 POST `/api/auth/login`
**Body:**
```json
{
  "email": "budi@test.com",
  "password": "Password123"
}
```
**Respons 200:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token-string"
  }
}
```

### 3.3 GET `/api/jobs`
**Query Parameters:**
- `page`: nomor halaman (default: `1`)
- `limit`: jumlah per halaman (default: `10`, max: `50`)
- `search`: cari berdasarkan judul posisi atau nama perusahaan
- `jobType`: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `FREELANCE`
- `location`: filter lokasi parsial

**Respons 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Senior Backend Engineer",
      "company": {
        "id": "uuid",
        "name": "Tech Corp"
      },
      "location": "Jakarta Selatan",
      "salaryMin": 15000000,
      "salaryMax": 25000000,
      "jobType": "FULL_TIME",
      "createdAt": "2026-11-05T09:45:00.000Z",
      "hasApplied": false
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}
```

### 3.4 POST `/api/jobs/:id/apply`
- Header: `Authorization: Bearer <token>`
- Role: `JOB_SEEKER`
- Status: `201 Created`
- Jika sudah melamar: `409 Conflict` ("Anda sudah melamar lowongan ini")

### 3.5 PATCH `/api/applications/:id/status`
- Header: `Authorization: Bearer <token>`
- Role: `COMPANY` (pemilik lowongan)
- Body:
```json
{
  "status": "REVIEWING",
  "note": "Memenuhi kualifikasi minimum teknis"
}
```
- Status: `200 OK`
- Jika status baru sama dengan status saat ini: `400 Bad Request`
- Jika bukan pemilik perusahaan: `404 Not Found`

