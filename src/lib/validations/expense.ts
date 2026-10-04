import { z } from "zod";

import { EXPENSE_CATEGORIES } from "@/constants/expense";

const dateSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Please enter a valid date"
  )
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);

    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, "Please enter a valid date");

export const createExpenseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters"),

  amount: z
    .number()
    .positive("Amount must be greater than zero"),

  category: z.enum(EXPENSE_CATEGORIES),

  date: dateSchema,
});

export const updateExpenseSchema =
  createExpenseSchema.partial();

export const expenseFilterSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES).optional(),
  from: dateSchema.optional(),
  to: dateSchema.optional(),
});