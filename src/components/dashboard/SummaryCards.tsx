"use client";

import { useEffect, useState } from "react";

import type { Expense } from "@/types/expense";

type Props = {
  expenses: Expense[];
};

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduce) {
      setValue(target);
      return;
    }

    let frame = 0;
    let start: number | null = null;
    const from = 0;

    const tick = (now: number) => {
      start ??= now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(from + (target - from) * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export default function SummaryCards({ expenses }: Props) {
  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categoryTotals = expenses.reduce<Record<string, number>>(
    (totals, expense) => {
      totals[expense.category] =
        (totals[expense.category] || 0) + expense.amount;

      return totals;
    },
    {}
  );

  const topCategory =
    Object.entries(categoryTotals).sort(
      ([, first], [, second]) => second - first
    )[0]?.[0] || "—";

  const animatedTotal = useCountUp(total);

  const formattedTotal = animatedTotal.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <section className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]">
      {/* Hero figure: the one bold element on the page */}
      <div className="reveal relative overflow-hidden rounded-[1.25rem] bg-brand-deep p-6 text-[#eef4f0] shadow-[0_24px_48px_-26px_rgba(33,79,69,0.9)] sm:p-8" style={{ "--i": 2 } as React.CSSProperties}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-10 h-56 w-56 rounded-full border border-white/10"
        />

        <p className="text-sm font-medium text-[#b9d1c6]">
          Total spent
        </p>

        <p className="num mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          ৳{formattedTotal}
        </p>

        <p className="mt-3 text-sm text-[#b9d1c6]">
          Across {expenses.length}{" "}
          {expenses.length === 1 ? "expense" : "expenses"}
        </p>
      </div>

      <div className="card reveal p-6 sm:p-7" style={{ "--i": 3 } as React.CSSProperties}>
        <p className="text-sm font-medium text-muted">
          Entries
        </p>

        <p className="num mt-3 font-display text-3xl font-semibold sm:text-4xl">
          {expenses.length}
        </p>

        <p className="mt-3 text-sm text-faint">
          Currently on record
        </p>
      </div>

      <div className="card reveal p-6 sm:p-7" style={{ "--i": 4 } as React.CSSProperties}>
        <p className="text-sm font-medium text-muted">
          Biggest category
        </p>

        <p className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          {topCategory}
        </p>

        <p className="mt-3 text-sm text-faint">
          Where most of your money went
        </p>
      </div>
    </section>
  );
}
