import { EXPENSE_CATEGORIES } from "../constants/expense";

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