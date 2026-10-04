import type { Expense } from "@/types/expense";

type Props = {
  expenses: Expense[];
};

export default function SummaryCards({
  expenses,
}: Props) {
  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categoryTotals = expenses.reduce<
    Record<string, number>
  >((totals, expense) => {
    totals[expense.category] =
      (totals[expense.category] || 0) +
      expense.amount;

    return totals;
  }, {});

  const topCategory =
    Object.entries(categoryTotals).sort(
      ([, first], [, second]) => second - first
    )[0]?.[0] || "—";

  const formattedTotal = total.toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  });

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-medium text-slate-500">
          Total Expense
        </p>

        <p className="mt-2 text-2xl font-bold sm:text-3xl">
          ৳{formattedTotal}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Across all recorded expenses
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-medium text-slate-500">
          Total Entries
        </p>

        <p className="mt-2 text-2xl font-bold sm:text-3xl">
          {expenses.length}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Expenses currently recorded
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 sm:p-6 xl:col-span-1">
        <p className="text-sm font-medium text-slate-500">
          Top Category
        </p>

        <p className="mt-2 text-2xl font-bold sm:text-3xl">
          {topCategory}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Highest spending category
        </p>
      </div>
    </section>
  );
}