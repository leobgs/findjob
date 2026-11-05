import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { signToken } from '../../utils/jwt';
import { RegisterInput, LoginInput } from './auth.schema';

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: Role;
  company?: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
  } | null;
}

export interface AuthResponseDto {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  token: string;
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponseDto> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw AppError.conflict('Email sudah terdaftar dalam sistem');
    }

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
          role: input.role,
        },
      });

      if (input.role === Role.COMPANY && input.companyName) {
        await tx.company.create({
          data: {
            userId: newUser.id,
            name: input.companyName,
          },
        });
      }

      return newUser;
    });

    const token = signToken({ sub: user.id, role: user.role });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(input: LoginInput): Promise<AuthResponseDto> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw AppError.unauthorized('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Email atau password salah');
    }

    const token = signToken({ sub: user.id, role: user.role });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: {
          select: {
            id: true,
            name: true,
            description: true,
            location: true,
          },
        },
      },
    });

    if (!user) {
      throw AppError.notFound('Pengguna tidak ditemukan');
    }

    return user;
  }
}

export const authService = new AuthService();

