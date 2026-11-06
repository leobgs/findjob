import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  User,
  Building,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16 py-4 sm:py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-primary/5 via-background to-background px-6 py-16 text-center shadow-sm sm:px-12 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Platform Karir & Rekrutmen Modern</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl sm:leading-tight">
            Hubungkan <span className="text-primary">Talenta Terbaik</span> dengan{' '}
            <span className="text-primary">Perusahaan Impian</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Indokerja mempermudah proses pencarian kerja dan rekrutmen. Transparan,
            cepat, dan dilengkapi pelacakan status lamaran real-time.
          </p>

          {/* Conditional CTA Area */}
          {user ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-sm font-medium text-foreground">
                  Selamat datang kembali, <span className="font-bold">{user.name}</span>!
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Link to={user.role === 'COMPANY' ? '/company/jobs' : '/jobs'}>
                    <Button className="gap-2">
                      <Briefcase className="h-4 w-4" />
                      Buka Dashboard {user.role === 'COMPANY' ? 'Perusahaan' : 'Pencari Kerja'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pilih Jalur Masuk Anda
              </div>

              {/* Distinct Role-based Login Buttons */}
              <div className="mx-auto grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Seeker CTA */}
                <Link
                  to="/login?role=JOB_SEEKER"
                  className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-primary/20 bg-card p-6 text-center shadow-sm transition hover:border-primary hover:bg-primary/5 hover:shadow-md"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="text-base font-bold text-foreground">
                    Masuk sebagai Pencari Kerja
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Lamar pekerjaan, pantau status, dan lihat riwayat seleksi
                  </p>
                  <span className="mt-4 inline-flex items-center text-xs font-semibold text-primary group-hover:underline">
                    Masuk Sekarang <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </Link>

                {/* Company CTA */}
                <Link
                  to="/login?role=COMPANY"
                  className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-primary/20 bg-card p-6 text-center shadow-sm transition hover:border-primary hover:bg-primary/5 hover:shadow-md"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110">
                    <Building className="h-6 w-6" />
                  </div>
                  <div className="text-base font-bold text-foreground">
                    Masuk sebagai Perusahaan
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pasang lowongan, kelola kandidat, dan perbarui status lamaran
                  </p>
                  <span className="mt-4 inline-flex items-center text-xs font-semibold text-primary group-hover:underline">
                    Masuk Sekarang <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                <span>Belum punya akun?</span>
                <Link
                  to="/register?role=JOB_SEEKER"
                  className="font-medium text-primary hover:underline"
                >
                  Daftar Pencari Kerja
                </Link>
                <span>•</span>
                <Link
                  to="/register?role=COMPANY"
                  className="font-medium text-primary hover:underline"
                >
                  Daftar Perusahaan
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Solusi Menyeluruh untuk Dua Peran
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fitur dirancang spesifik untuk kebutuhan pencari kerja dan perusahaan
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* For Seekers */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Untuk Pencari Kerja</h3>
                <p className="text-xs text-muted-foreground">
                  Kemudahan menemukan karir terbaik
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>Eksplor lowongan terbuka dengan filter lokasi & tipe pekerjaan lengkap</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>Kirim lamaran instan dengan dialog konfirmasi anti-duplikasi</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>Pelacakan kronologi status lamaran transparan (Reviewing, Shortlisted, dll.)</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link to="/register?role=JOB_SEEKER">
                <Button variant="outline" size="sm" className="w-full">
                  Mulai Mencari Kerja
                </Button>
              </Link>
            </div>
          </div>

          {/* For Companies */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Untuk Perusahaan</h3>
                <p className="text-xs text-muted-foreground">
                  Efisiensi pipeline rekrutmen talenta
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>Publikasikan lowongan kerja terperinci dengan rentang gaji yang jelas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>Pantau pelamar masuk secara terpusat dengan indikator jumlah kandidat</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>Ubah status kandidat dengan mudah disertai catatan hasil evaluasi</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link to="/register?role=COMPANY">
                <Button variant="outline" size="sm" className="w-full">
                  Mulai Rekrut Talenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Guarantees */}
      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-border/70 bg-muted/30 p-6 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
          <div>
            <div className="text-sm font-bold text-foreground">Aman & Terverifikasi</div>
            <div className="text-xs text-muted-foreground">Keamanan data terjamin</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-emerald-600 shrink-0" />
          <div>
            <div className="text-sm font-bold text-foreground">Peluang Karir Tinggi</div>
            <div className="text-xs text-muted-foreground">Dari startup hingga enterprise</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-blue-600 shrink-0" />
          <div>
            <div className="text-sm font-bold text-foreground">Proses Efisien</div>
            <div className="text-xs text-muted-foreground">Tanpa alur berbelit-belit</div>
          </div>
        </div>
      </section>
    </div>
  );
};

