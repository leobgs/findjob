import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { loginFormSchema, LoginFormValues } from "@/features/auth/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Briefcase, AlertCircle, Sparkles, User, Building } from "lucide-react";
import axios from "axios";
import { ApiResponse, Role } from "@/types";
import { toast } from "sonner";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const roleParam = searchParams.get("role");
  const [selectedRole, setSelectedRole] = useState<Role>(
    roleParam === "COMPANY" ? "COMPANY" : "JOB_SEEKER",
  );

  const [serverError, setServerError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from
    ?.pathname;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (roleParam === "COMPANY" || roleParam === "JOB_SEEKER") {
      setSelectedRole(roleParam);
    }
  }, [roleParam]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setSearchParams({ role });
    setServerError(null);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const user = await login(data);

      toast.success(
        `Selamat datang, ${user.name}! Masuk sebagai ${
          user.role === "COMPANY" ? "Perusahaan" : "Pencari Kerja"
        }.`,
      );

      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(user.role === "COMPANY" ? "/company/jobs" : "/jobs", {
          replace: true,
        });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiResponse>(err)) {
        setServerError(
          err.response?.data?.message ||
            "Login gagal, periksa email dan kata sandi Anda.",
        );
      } else {
        setServerError("Terjadi kesalahan jaringan, silakan coba lagi.");
      }
    }
  };

  const fillDemo = (email: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", "Password123", { shouldValidate: true });
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <Briefcase className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Masuk ke Indokerja
          </CardTitle>
          <CardDescription>
            {selectedRole === "COMPANY"
              ? "Portal Perusahaan: Kelola lowongan dan tinjau kandidat pelamar"
              : "Portal Pencari Kerja: Lamar pekerjaan dan pantau status seleksi"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Role Switcher Buttons */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => handleRoleSelect("JOB_SEEKER")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition ${
                selectedRole === "JOB_SEEKER"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Sebagai Pekerja</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("COMPANY")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition ${
                selectedRole === "COMPANY"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building className="h-4 w-4" />
              <span>Sebagai Perusahaan</span>
            </button>
          </div>

          {serverError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Email {selectedRole === "COMPANY" ? "Perusahaan" : "Akun"}
              </label>
              <Input
                type="email"
                placeholder={
                  selectedRole === "COMPANY"
                    ? "admin@perusahaan.com"
                    : "nama@email.com"
                }
                {...register("email")}
                error={errors.email?.message}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Kata Sandi
              </label>
              <PasswordInput
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Masuk sebagai{" "}
              {selectedRole === "COMPANY" ? "Perusahaan" : "Pencari Kerja"}
            </Button>
          </form>

          {/* Quick Demo Credentials
          // <div className="mt-6 rounded-lg border border-border bg-muted/40 p-3">
          //   <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
          //     <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          //     Akun Demo Cepat ({selectedRole === 'COMPANY' ? 'Perusahaan' : 'Pekerja'}):
          //   </div>
          //   <div className="grid grid-cols-2 gap-2 text-xs">
          //     <button
          //       type="button"
          //       onClick={() => {
          //         setSelectedRole('JOB_SEEKER');
          //         fillDemo('seeker@test.com');
          //       }}
          //       className={`rounded-md border p-2 text-left transition ${
          //         selectedRole === 'JOB_SEEKER'
          //           ? 'border-primary bg-primary/5 text-primary'
          //           : 'border-border bg-background hover:border-primary'
          //       }`}
          //     >
          //       <div className="font-medium text-foreground">Budi Santoso</div>
          //       <div className="truncate text-muted-foreground">seeker@test.com</div>
          //     </button>

          //     <button
          //       type="button"
          //       onClick={() => {
          //         setSelectedRole('COMPANY');
          //         fillDemo('company@test.com');
          //       }}
          //       className={`rounded-md border p-2 text-left transition ${
          //         selectedRole === 'COMPANY'
          //           ? 'border-primary bg-primary/5 text-primary'
          //           : 'border-border bg-background hover:border-primary'
          //       }`}
          //     >
          //       <div className="font-medium text-foreground">Tech Corp</div>
          //       <div className="truncate text-muted-foreground">company@test.com</div>
          //     </button>
          //   </div>
          // </div> */}

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              to={`/register?role=${selectedRole}`}
              className="font-medium text-primary hover:underline"
            >
              Daftar sebagai{" "}
              {selectedRole === "COMPANY" ? "Perusahaan" : "Pencari Kerja"}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
