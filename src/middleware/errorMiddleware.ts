import { Prisma } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
  status?: string;
}

/**
 * 404 Not Found handler
 * Creates an error for routes that don't exist
 */
const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Route ${req.originalUrl} not found`) as ErrorWithStatusCode;
  error.statusCode = 404;
  next(error);
};

/**
 * Global error handler middleware
 * Handles all errors in the application and sends appropriate responses
 * Provides detailed error information in development, minimal info in production
 */
const errorHandler = (err: ErrorWithStatusCode | Prisma.PrismaClientValidationError | Prisma.PrismaClientKnownRequestError, req: Request, res: Response, next: NextFunction): void => {
  let error: ErrorWithStatusCode = err as ErrorWithStatusCode;
  
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    error.statusCode = 400;
    error.message = "Invalid data provided";
  }

  // Handle Prisma unique constraint violations and other known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field = (err.meta?.target as string[])?.[0] || "field";
      error.statusCode = 400;
      error.message = `${field} already exists`;
    }
    // Handle record not found
    if (err.code === "P2025") {
      error.statusCode = 404;
      error.message = "Record not found";
    }
    // Handle foreign key constraint violations
    if (err.code === "P2003") {
      error.statusCode = 400;
      error.message = "Invalid reference: related record does not exist";
    }
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    status: error.status,
    message: error.message,
    // Only include stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export { notFound, errorHandler };