import { EXPENSE_CATEGORIES } from "@/constants/expense";

export type ExpenseCategory =
  (typeof EXPENSE_CATEGORIES)[number];

export interface IExpense {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface ExpenseFilters {
  category?: ExpenseCategory;
  from?: string;
  to?: string;
}