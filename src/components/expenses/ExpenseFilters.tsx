"use client";

import {
  FormEvent,
  useState,
} from "react";

import { EXPENSE_CATEGORIES } from "@/constants/expense";

import type {
  ExpenseCategory,
  ExpenseFilters as ExpenseFilterValues,
} from "@/types/expense";

type Props = {
  activeFilters: ExpenseFilterValues;
  loading: boolean;
  onApply: (filters: ExpenseFilterValues) => void;
  onReset: () => void;
};

export default function ExpenseFilters({
  activeFilters,
  loading,
  onApply,
  onReset,
}: Props) {
  const [category, setCategory] =
    useState<ExpenseCategory | "">(
      activeFilters.category || ""
    );

  const [from, setFrom] = useState(
    activeFilters.from || ""
  );

  const [to, setTo] = useState(
    activeFilters.to || ""
  );

  const invalidRange = Boolean(
    from && to && from > to
  );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (invalidRange) {
      return;
    }

    const filters: ExpenseFilterValues = {};

    if (category) {
      filters.category = category;
    }

    if (from) {
      filters.from = from;
    }

    if (to) {
      filters.to = to;
    }

    onApply(filters);
  }

  function handleReset() {
    setCategory("");
    setFrom("");
    setTo("");

    onReset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-2xl bg-canvas/60 p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label
            htmlFor="filter-category"
            className="label"
          >
            Category
          </label>

          <select
            id="filter-category"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value as ExpenseCategory | ""
              )
            }
            className="field"
          >
            <option value="">
              All Categories
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
            htmlFor="filter-from"
            className="label"
          >
            From
          </label>

          <input
            id="filter-from"
            type="date"
            value={from}
            onChange={(event) =>
              setFrom(event.target.value)
            }
            className="field"
          />
        </div>

        <div>
          <label
            htmlFor="filter-to"
            className="label"
          >
            To
          </label>

          <input
            id="filter-to"
            type="date"
            value={to}
            onChange={(event) =>
              setTo(event.target.value)
            }
            className="field"
          />
        </div>

        <div className="flex items-end gap-2 sm:col-span-2 xl:col-span-1">
          <button
            type="submit"
            disabled={loading || invalidRange}
            className="btn btn-primary flex-1"
          >
            {loading ? "Applying..." : "Apply"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="btn btn-ghost flex-1"
          >
            Reset
          </button>
        </div>
      </div>

      {invalidRange && (
        <p className="mt-2 text-sm text-danger">
          From date cannot be after to date.
        </p>
      )}
    </form>
  );
}