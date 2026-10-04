"use client";

import {
  useEffect,
  useState,
} from "react";

import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseList from "@/components/expenses/ExpenseList";
import SummaryCards from "@/components/dashboard/SummaryCards";

import {
  deleteExpense,
  fetchExpenses,
} from "@/redux/features/expenses/expenseSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";

import type { Expense } from "@/types/expense";

export default function ExpenseDashboard() {
  const dispatch = useAppDispatch();

  const {
    items: expenses,
    status,
    error,
  } = useAppSelector(
    (state) => state.expenses
  );

  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchExpenses());
    }
  }, [dispatch, status]);

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);

    requestAnimationFrame(() => {
      document
        .getElementById("expense-form")
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
    } catch {
      // Redux displays the request error below.
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 2xl:px-10">
        <header className="mb-6 sm:mb-8">
          <p className="text-sm font-medium text-slate-500">
            Personal Finance
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Expense Tracker
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
            Track daily expenses and understand where
            your money is going.
          </p>
        </header>

        <SummaryCards expenses={expenses} />

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 xl:col-span-3">
            <ExpenseForm
              editingExpense={editingExpense}
              onCancelEdit={() =>
                setEditingExpense(null)
              }
            />
          </div>

          <div className="min-w-0 lg:col-span-8 xl:col-span-9">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5 sm:p-6">
                <h2 className="text-lg font-semibold">
                  Expense History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your expense records.
                </p>
              </div>

              <div className="p-4 sm:p-6">
                {status === "loading" ? (
                  <div className="flex min-h-56 items-center justify-center">
                    <p className="text-sm text-slate-500">
                      Loading expenses...
                    </p>
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

        <section className="mt-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold">
              Expense Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Category analytics will be added here.
            </p>

            <div className="mt-6 flex min-h-52 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
              <p className="text-sm text-slate-400">
                Expense chart coming soon
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}