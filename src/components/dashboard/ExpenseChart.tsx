"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { EXPENSE_CATEGORIES } from "@/constants/expense";

import type { Expense } from "@/types/expense";

type Props = {
  expenses: Expense[];
};

const categoryColors: Record<string, string> = {
  Food: "#f97316",
  Transport: "#3b82f6",
  Shopping: "#8b5cf6",
  Others: "#64748b",
};

export default function ExpenseChart({
  expenses,
}: Props) {
  const chartData = EXPENSE_CATEGORIES.map(
    (category) => {
      const total = expenses
        .filter(
          (expense) =>
            expense.category === category
        )
        .reduce(
          (sum, expense) =>
            sum + expense.amount,
          0
        );

      return {
        name: category,
        value: total,
      };
    }
  ).filter((item) => item.value > 0);

  if (!chartData.length) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
        <div className="text-center">
          <p className="font-medium">
            No chart data
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Add expenses to see your category breakdown.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full sm:h-[340px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius="45%"
            outerRadius="72%"
            paddingAngle={3}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={
                  categoryColors[entry.name]
                }
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) =>
              `৳${Number(value).toLocaleString(
                "en-BD"
              )}`
            }
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}