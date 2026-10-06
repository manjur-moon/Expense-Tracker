"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  CATEGORY_COLORS,
  EXPENSE_CATEGORIES,
} from "@/constants/expense";

import type { Expense } from "@/types/expense";

type Props = {
  expenses: Expense[];
};

function formatMoney(value: number) {
  return `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;
}

export default function ExpenseChart({ expenses }: Props) {
  const chartData = EXPENSE_CATEGORIES.map((category) => ({
    name: category,
    value: expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0),
  })).filter((item) => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (!chartData.length) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-line bg-canvas/50">
        <div className="text-center">
          <p className="font-display text-lg font-semibold">
            No spending to show
          </p>

          <p className="mt-1 text-sm text-muted">
            Add an expense to see how it splits by category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
      <div className="relative mx-auto h-[260px] w-full max-w-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius="64%"
              outerRadius="92%"
              paddingAngle={3}
              cornerRadius={6}
              stroke="none"
              animationDuration={900}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => formatMoney(Number(value))}
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                boxShadow: "0 12px 28px -16px rgba(30,43,39,.35)",
                color: "var(--ink)",
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-medium text-muted">Total</span>
          <span className="num font-display text-xl font-semibold">
            {formatMoney(total)}
          </span>
        </div>
      </div>

      <ul className="space-y-5">
        {chartData
          .slice()
          .sort((a, b) => b.value - a.value)
          .map((item) => {
            const share = (item.value / total) * 100;

            return (
              <li key={item.name}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="flex items-center gap-2.5 text-sm font-semibold">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[item.name] }}
                    />
                    {item.name}
                  </span>

                  <span className="num text-sm text-muted">
                    <span className="font-semibold text-ink">
                      {formatMoney(item.value)}
                    </span>{" "}
                    · {share.toFixed(0)}%
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas">
                  <div
                    className="bar-grow h-full rounded-full"
                    style={{
                      width: `${share}%`,
                      backgroundColor: CATEGORY_COLORS[item.name],
                    }}
                  />
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
