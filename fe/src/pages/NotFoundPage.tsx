import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        404 - Halaman Tidak Ditemukan
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau Anda
        tidak memiliki hak akses ke halaman tersebut.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
};

