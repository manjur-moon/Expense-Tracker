"use client";

import { CATEGORY_COLORS } from "@/constants/expense";

import type { Expense } from "@/types/expense";

type Props = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
};

function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] ?? "#7f9188";

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1 text-xs font-semibold text-ink">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {category}
    </span>
  );
}

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
      <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-line">
        <div className="text-center">
          <p className="font-medium">
            Nothing here yet
          </p>

          <p className="mt-1 text-sm text-muted">
            Add your first expense and it will show up here.
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
            className="row-in rounded-2xl border border-line bg-canvas/40 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate font-semibold">
                  {expense.title}
                </h3>

                <p className="mt-1 text-sm text-muted">
                  {formatDate(expense.date)}
                </p>
              </div>

              <p className="num shrink-0 font-semibold">
                {formatAmount(expense.amount)}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <CategoryBadge category={expense.category} />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(expense)}
                  className="btn btn-ghost btn-sm"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(expense)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="text-muted">
              <th className="sticky top-0 z-10 border-b border-line bg-surface pb-3 pr-4 text-sm font-semibold">
                Expense
              </th>

              <th className="sticky top-0 z-10 border-b border-line bg-surface pb-3 pr-4 text-sm font-semibold">
                Category
              </th>

              <th className="sticky top-0 z-10 border-b border-line bg-surface pb-3 pr-4 text-sm font-semibold">
                Date
              </th>

              <th className="sticky top-0 z-10 border-b border-line bg-surface pb-3 pr-4 text-right text-sm font-semibold">
                Amount
              </th>

              <th className="sticky top-0 z-10 border-b border-line bg-surface pb-3 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense._id}
                className="row-in border-b border-line/60 transition-colors last:border-0 hover:bg-brand-soft/40"
              >
                <td className="py-4 pr-4 font-medium">
                  {expense.title}
                </td>

                <td className="py-4 pr-4">
                  <CategoryBadge category={expense.category} />
                </td>

                <td className="py-4 pr-4 text-sm text-muted">
                  {formatDate(expense.date)}
                </td>

                <td className="py-4 pr-4 text-right num font-semibold">
                  {formatAmount(expense.amount)}
                </td>

                <td className="py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(expense)
                      }
                      className="btn btn-ghost btn-sm"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(expense)
                      }
                      className="btn btn-danger btn-sm"
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