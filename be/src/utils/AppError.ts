export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Permintaan tidak valid'): AppError {
    return new AppError(message, 400);
  }

  static unauthorized(message = 'Autentikasi diperlukan atau token tidak valid'): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Anda tidak memiliki akses ke sumber daya ini'): AppError {
    return new AppError(message, 403);
  }

  static notFound(message = 'Sumber daya tidak ditemukan'): AppError {
    return new AppError(message, 404);
  }

  static conflict(message = 'Terjadi konflik data'): AppError {
    return new AppError(message, 409);
  }

  static internal(message = 'Terjadi kesalahan internal server'): AppError {
    return new AppError(message, 500, false);
  }
}

