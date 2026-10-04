import { z } from "zod";

import { EXPENSE_CATEGORIES } from "@/constants/expense";

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

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date"),
});

export const updateExpenseSchema = createExpenseSchema.partial();