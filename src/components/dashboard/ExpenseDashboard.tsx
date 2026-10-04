"use client";

import { useEffect, useState } from "react";

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
    <main className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 2xl:px-10">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Personal Finance
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Expense Tracker
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                Track daily expenses and understand
                where your money is going.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              {/* Add Expense Button */}
              <button
                type="button"
                onClick={scrollToAddExpense}
                aria-controls="add-expense-section"
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition duration-200 hover:border-slate-400 hover:bg-slate-100 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 sm:w-auto"
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

                <span>Add Expense</span>
              </button>

              {/* Expense List Button */}
              <button
                type="button"
                onClick={scrollToExpenseList}
                aria-controls="expense-list"
                className="group flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:w-auto"
              >
                <span>Expense List</span>

                <span className="flex min-w-6 items-center justify-center rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold">
                  {expenses.length}
                </span>

                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                >
                  <path
                    d="M5 7.5 10 12.5 15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <SummaryCards expenses={expenses} />

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Main Dashboard */}
        <section className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Add / Edit Expense */}
          <div
            id="add-expense-section"
            className={`relative scroll-mt-8 rounded-2xl transition-all duration-500 lg:col-span-4 xl:col-span-3 ${
              highlightAddExpense
                ? "scale-[1.02] ring-4 ring-emerald-300/70 ring-offset-4 ring-offset-slate-50 shadow-2xl shadow-emerald-100/70"
                : "scale-100"
            }`}
          >
            {/* Add Expense Floating Highlight */}
            <div
              className={`pointer-events-none absolute -top-3 left-5 z-20 transition-all duration-300 ${
                highlightAddExpense
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <div className="flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                Add Expense
              </div>
            </div>

            <ExpenseForm
              key={
                editingExpense?._id ??
                "new-expense"
              }
              editingExpense={editingExpense}
              onCancelEdit={() =>
                setEditingExpense(null)
              }
              onSaved={refreshExpenses}
            />
          </div>

          {/* Expense History */}
          <div
            id="expense-list"
            className={`relative min-w-0 scroll-mt-8 rounded-2xl transition-all duration-500 lg:col-span-8 xl:col-span-9 ${
              highlightExpenseList
                ? "scale-[1.01] ring-4 ring-blue-300/70 ring-offset-4 ring-offset-slate-50 shadow-2xl shadow-blue-100/70"
                : "scale-100"
            }`}
          >
            {/* Expense List Floating Highlight */}
            <div
              className={`pointer-events-none absolute -top-3 left-5 z-20 transition-all duration-300 ${
                highlightExpenseList
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <div className="flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                Expense List
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Expense List Header */}
              <div className="border-b border-slate-200 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Expense History
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      View, filter and manage your
                      expense records.
                    </p>
                  </div>

                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {expenses.length}{" "}
                    {expenses.length === 1
                      ? "expense"
                      : "expenses"}
                  </div>
                </div>

                {/* Filters */}
                <ExpenseFilters
                  activeFilters={activeFilters}
                  loading={status === "loading"}
                  onApply={handleApplyFilters}
                  onReset={handleResetFilters}
                />
              </div>

              {/* Expense Data */}
              <div className="p-4 sm:p-6">
                {status === "loading" ? (
                  <div className="flex min-h-56 items-center justify-center">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />

                      <span>
                        Loading expenses...
                      </span>
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
        <section className="mt-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-lg font-semibold">
                Expense Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Spending breakdown by category.
              </p>
            </div>

            <div className="mt-4">
              <ExpenseChart expenses={expenses} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}