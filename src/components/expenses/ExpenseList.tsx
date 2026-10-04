"use client";

import type { Expense } from "@/types/expense";

type Props = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
};

const badgeStyles: Record<string, string> = {
  Food: "bg-orange-50 text-orange-700",
  Transport: "bg-blue-50 text-blue-700",
  Shopping: "bg-violet-50 text-violet-700",
  Others: "bg-slate-100 text-slate-700",
};

function formatAmount(amount: number) {
  return `৳${amount.toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  const [year, month, day] = value
    .slice(0, 10)
    .split("-")
    .map(Number);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
}: Props) {
  if (!expenses.length) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-slate-300">
        <div className="text-center">
          <p className="font-medium">
            No expenses yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Add your first expense to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {expenses.map((expense) => (
          <article
            key={expense._id}
            className="rounded-xl border border-slate-200 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate font-semibold">
                  {expense.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(expense.date)}
                </p>
              </div>

              <p className="shrink-0 font-semibold">
                {formatAmount(expense.amount)}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  badgeStyles[expense.category]
                }`}
              >
                {expense.category}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(expense)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(expense)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="pb-3 pr-4 font-medium">
                Expense
              </th>

              <th className="pb-3 pr-4 font-medium">
                Category
              </th>

              <th className="pb-3 pr-4 font-medium">
                Date
              </th>

              <th className="pb-3 pr-4 text-right font-medium">
                Amount
              </th>

              <th className="pb-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense._id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="py-4 pr-4 font-medium">
                  {expense.title}
                </td>

                <td className="py-4 pr-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      badgeStyles[expense.category]
                    }`}
                  >
                    {expense.category}
                  </span>
                </td>

                <td className="py-4 pr-4 text-sm text-slate-500">
                  {formatDate(expense.date)}
                </td>

                <td className="py-4 pr-4 text-right font-semibold">
                  {formatAmount(expense.amount)}
                </td>

                <td className="py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(expense)
                      }
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium transition hover:bg-slate-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(expense)
                      }
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}