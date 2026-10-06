"use client";

import { useEffect, useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import SummaryCards from "@/components/dashboard/SummaryCards";
import ExpenseFilters from "@/components/expenses/ExpenseFilters";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseList from "@/components/expenses/ExpenseList";

import {
  deleteExpense,
  fetchExpenses,
} from "@/redux/features/expenses/expenseSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";

import type {
  Expense,
  ExpenseFilters as ExpenseFilterValues,
} from "@/types/expense";

const stagger = (i: number) =>
  ({ "--i": i }) as React.CSSProperties;

export default function ExpenseDashboard() {
  const dispatch = useAppDispatch();

  const {
    items: expenses,
    status,
    error,
  } = useAppSelector((state) => state.expenses);

  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null);

  const [activeFilters, setActiveFilters] =
    useState<ExpenseFilterValues>({});

  const [
    highlightExpenseList,
    setHighlightExpenseList,
  ] = useState(false);

  const [
    highlightAddExpense,
    setHighlightAddExpense,
  ] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchExpenses({}));
    }
  }, [dispatch, status]);

  function scrollToAddExpense() {
    setEditingExpense(null);
    setHighlightAddExpense(false);

    requestAnimationFrame(() => {
      const addExpenseSection =
        document.getElementById(
          "add-expense-section"
        );

      if (!addExpenseSection) {
        return;
      }

      addExpenseSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.setTimeout(() => {
        setHighlightAddExpense(true);
      }, 250);

      window.setTimeout(() => {
        setHighlightAddExpense(false);
      }, 2050);
    });
  }

  function scrollToExpenseList() {
    const expenseList =
      document.getElementById("expense-list");

    if (!expenseList) {
      return;
    }

    setHighlightExpenseList(false);

    expenseList.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.setTimeout(() => {
      setHighlightExpenseList(true);
    }, 250);

    window.setTimeout(() => {
      setHighlightExpenseList(false);
    }, 2050);
  }

  function refreshExpenses() {
    dispatch(fetchExpenses(activeFilters));
  }

  function handleApplyFilters(
    filters: ExpenseFilterValues
  ) {
    setActiveFilters(filters);
    dispatch(fetchExpenses(filters));
  }

  function handleResetFilters() {
    const filters: ExpenseFilterValues = {};

    setActiveFilters(filters);
    dispatch(fetchExpenses(filters));
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);

    requestAnimationFrame(() => {
      document
        .getElementById("add-expense-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  }

  async function handleDelete(expense: Expense) {
    const confirmed = window.confirm(
      `Delete "${expense.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        deleteExpense(expense._id)
      ).unwrap();

      if (editingExpense?._id === expense._id) {
        setEditingExpense(null);
      }

      dispatch(fetchExpenses(activeFilters));
    } catch {
      // Redux error state handles the message.
    }
  }

  return (
    <main className="min-h-screen w-full text-ink">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10 lg:py-12">
        {/* Header */}
        <header
          className="reveal mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
          style={stagger(0)}
        >
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand text-[color:var(--on-brand)] shadow-lg shadow-brand/25"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path
                  d="M4 8.5A2.5 2.5 0 0 1 6.5 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5v-8Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M4 9h13.5M15.5 13.5h2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Expense Tracker
              </h1>

              <p className="mt-1.5 max-w-xl text-[0.95rem] text-muted">
                See where your money goes, one expense at a time.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
            <ThemeToggle />
            <button
              type="button"
              onClick={scrollToAddExpense}
              aria-controls="add-expense-section"
              className="group btn btn-primary w-full sm:w-auto"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
              >
                <path
                  d="M10 4V16M4 10H16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              Add expense
            </button>

            <button
              type="button"
              onClick={scrollToExpenseList}
              aria-controls="expense-list"
              className="group btn btn-ghost w-full sm:w-auto"
            >
              View expenses
              <span className="num rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-deep">
                {expenses.length}
              </span>
            </button>
          </div>
        </header>

        <SummaryCards expenses={expenses} />

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            {error}
          </div>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Add / Edit Expense */}
          <div
            id="add-expense-section"
            style={stagger(5)}
            className={`reveal relative scroll-mt-8 rounded-[1.25rem] transition-all duration-500 lg:col-span-4 xl:col-span-3 ${
              highlightAddExpense
                ? "ring-4 ring-brand/30 ring-offset-4 ring-offset-canvas"
                : ""
            }`}
          >
            <ExpenseForm
              key={editingExpense?._id ?? "new-expense"}
              editingExpense={editingExpense}
              onCancelEdit={() => setEditingExpense(null)}
              onSaved={refreshExpenses}
            />
          </div>

          {/* Expense History */}
          <div
            id="expense-list"
            style={stagger(6)}
            className={`reveal relative min-w-0 scroll-mt-8 rounded-[1.25rem] transition-all duration-500 lg:col-span-8 xl:col-span-9 ${
              highlightExpenseList
                ? "ring-4 ring-brand/30 ring-offset-4 ring-offset-canvas"
                : ""
            }`}
          >
            <div className="card overflow-hidden">
              <div className="border-b border-line p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold tracking-tight">
                      Expense history
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                      Filter, edit or remove any record.
                    </p>
                  </div>

                  <div className="num rounded-full bg-brand-soft px-3.5 py-1 text-xs font-semibold text-brand-deep">
                    {expenses.length}{" "}
                    {expenses.length === 1 ? "expense" : "expenses"}
                  </div>
                </div>

                <ExpenseFilters
                  activeFilters={activeFilters}
                  loading={status === "loading"}
                  onApply={handleApplyFilters}
                  onReset={handleResetFilters}
                />
              </div>

              <div className="p-4 sm:p-7">
                {status === "loading" ? (
                  <div className="flex min-h-56 items-center justify-center">
                    <div className="flex items-center gap-3 text-sm text-muted">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand" />
                      <span>Loading expenses…</span>
                    </div>
                  </div>
                ) : (
                  <ExpenseList
                    expenses={expenses}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Analytics */}
        <section className="reveal mt-6" style={stagger(7)}>
          <div className="card p-5 sm:p-7">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Spending by category
              </h2>

              <p className="mt-1 text-sm text-muted">
                How your total splits across categories.
              </p>
            </div>

            <div className="mt-6">
              <ExpenseChart expenses={expenses} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
