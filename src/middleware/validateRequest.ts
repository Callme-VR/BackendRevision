import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

/**
 * Middleware to validate request body against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      res.status(400).json({ 
        error: "Validation failed",
        message: errors.join(", ")
      });
      return;
    }

    // Assign validated data to request body
    req.body = result.data;
    next();
  };
};

/**
 * Format Zod errors into a readable array of error messages
 * @param error - ZodError instance
 * @returns Array of formatted error messages
 */
function formatZodErrors(error: ZodError): string[] {
  const errors: string[] = [];

  error.issues.forEach((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "root";
    errors.push(`${path}: ${issue.message}`);
  });

  return errors;
}