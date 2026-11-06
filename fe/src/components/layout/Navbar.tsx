import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Briefcase,
  LogOut,
  Menu,
  X,
  PlusCircle,
  FileText,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Indokerja
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        {user && (
          <div className="hidden md:flex md:items-center md:gap-6">
            {user.role === 'JOB_SEEKER' ? (
              <>
                <Link
                  to="/jobs"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/jobs')
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Search className="h-4 w-4" />
                  Eksplor Lowongan
                </Link>
                <Link
                  to="/my-applications"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/my-applications')
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Lamaran Saya
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/company/jobs"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/company/jobs')
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  Kelola Lowongan
                </Link>
                <Link
                  to="/company/jobs/new"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/company/jobs/new')
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground'
                  }`}
                >
                  <PlusCircle className="h-4 w-4" />
                  Buat Lowongan
                </Link>
              </>
            )}
          </div>
        )}

        {/* User / Auth Actions */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium leading-none text-foreground">
                  {user.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {user.role === 'COMPANY'
                    ? user.company?.name || 'Perusahaan'
                    : 'Job Seeker'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login?role=JOB_SEEKER">
                <Button variant="ghost" size="sm" className="text-xs">
                  Masuk Pekerja
                </Button>
              </Link>
              <Link to="/login?role=COMPANY">
                <Button variant="outline" size="sm" className="text-xs">
                  Masuk Perusahaan
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="text-xs">
                  Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 pb-4 pt-2 md:hidden">
          {user ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.role === 'COMPANY'
                    ? user.company?.name || 'Perusahaan'
                    : 'Job Seeker'}{' '}
                  • {user.email}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                {user.role === 'JOB_SEEKER' ? (
                  <>
                    <Link
                      to="/jobs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Eksplor Lowongan
                    </Link>
                    <Link
                      to="/my-applications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Lamaran Saya
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/company/jobs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Kelola Lowongan
                    </Link>
                    <Link
                      to="/company/jobs/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Buat Lowongan
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={logout}
                  className="w-full gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar dari Aplikasi
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/login?role=JOB_SEEKER" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start text-xs">
                  Masuk sebagai Pencari Kerja
                </Button>
              </Link>
              <Link to="/login?role=COMPANY" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start text-xs">
                  Masuk sebagai Perusahaan
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full text-xs">Daftar Akun Baru</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

