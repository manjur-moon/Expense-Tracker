"use client";

import {
  FormEvent,
  useState,
} from "react";

import { EXPENSE_CATEGORIES } from "@/constants/expense";

import {
  createExpense,
  updateExpense,
} from "@/redux/features/expenses/expenseSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";

import type {
  Expense,
  ExpenseCategory,
} from "@/types/expense";

type Props = {
  editingExpense: Expense | null;
  onCancelEdit: () => void;
  onSaved: () => void;
};

function getToday() {
  const now = new Date();

  const local = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 10);
}

export default function ExpenseForm({
  editingExpense,
  onCancelEdit,
  onSaved,
}: Props) {
  const dispatch = useAppDispatch();

  const saving = useAppSelector(
    (state) => state.expenses.saving
  );

  const [title, setTitle] = useState(
    editingExpense?.title || ""
  );

  const [amount, setAmount] = useState(
    editingExpense
      ? String(editingExpense.amount)
      : ""
  );

  const [category, setCategory] =
    useState<ExpenseCategory | "">(
      editingExpense?.category || ""
    );

  const [date, setDate] = useState(
    editingExpense
      ? editingExpense.date.slice(0, 10)
      : getToday()
  );

  const [formError, setFormError] =
    useState("");

  function resetForm() {
    setTitle("");
    setAmount("");
    setCategory("");
    setDate(getToday());
    setFormError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (
      title.trim().length < 2 ||
      !category ||
      !date ||
      numericAmount <= 0
    ) {
      setFormError(
        "Please enter valid expense information."
      );

      return;
    }

    const data = {
      title: title.trim(),
      amount: numericAmount,
      category,
      date,
    };

    try {
      if (editingExpense) {
        await dispatch(
          updateExpense({
            id: editingExpense._id,
            data,
          })
        ).unwrap();

        onCancelEdit();
      } else {
        await dispatch(
          createExpense(data)
        ).unwrap();

        resetForm();
      }

      onSaved();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Could not save expense"
      );
    }
  }

  function handleCancel() {
    onCancelEdit();
  }

  return (
    <div
      id="expense-form"
      className="card p-5 sm:p-7"
    >
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {editingExpense
            ? "Edit Expense"
            : "Add Expense"}
        </h2>

        <p className="mt-1 text-sm text-muted">
          {editingExpense
            ? "Update the selected expense."
            : "Add a new expense to your records."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="title"
            className="label"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="e.g. Lunch"
            maxLength={100}
            required
            className="field"
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="label"
          >
            Amount
          </label>

          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
            className="field"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="label"
          >
            Category
          </label>

          <select
            id="category"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value as ExpenseCategory
              )
            }
            required
            className="field"
          >
            <option value="">
              Select category
            </option>

            {EXPENSE_CATEGORIES.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="date"
            className="label"
          >
            Date
          </label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            required
            className="field"
          />
        </div>

        {formError && (
          <p className="text-sm text-danger">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary w-full"
        >
          {saving
            ? "Saving..."
            : editingExpense
              ? "Update Expense"
              : "Add Expense"}
        </button>

        {editingExpense && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="btn btn-ghost w-full"
          >
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
}