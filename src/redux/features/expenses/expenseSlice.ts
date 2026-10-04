import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import type {
  Expense,
  ExpenseInput,
} from "@/types/expense";

type ExpensesState = {
  items: Expense[];
  status: "idle" | "loading" | "succeeded" | "failed";
  saving: boolean;
  error: string | null;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const initialState: ExpensesState = {
  items: [],
  status: "idle",
  saving: false,
  error: null,
};

async function getResponse<T>(response: Response) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Something went wrong"
    );
  }

  return result as T;
}

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async () => {
    const response = await fetch("/api/expenses");

    const result =
      await getResponse<ApiResponse<Expense[]>>(response);

    return result.data;
  }
);

export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (data: ExpenseInput) => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result =
      await getResponse<ApiResponse<Expense>>(response);

    return result.data;
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<ExpenseInput>;
  }) => {
    const response = await fetch(
      `/api/expenses/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result =
      await getResponse<ApiResponse<Expense>>(response);

    return result.data;
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id: string) => {
    const response = await fetch(
      `/api/expenses/${id}`,
      {
        method: "DELETE",
      }
    );

    await getResponse(response);

    return id;
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message ||
          "Could not load expenses";
      })

      .addCase(createExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.error.message ||
          "Could not create expense";
      })

      .addCase(updateExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.saving = false;

        const index = state.items.findIndex(
          (expense) =>
            expense._id === action.payload._id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.error.message ||
          "Could not update expense";
      })

      .addCase(deleteExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.saving = false;

        state.items = state.items.filter(
          (expense) => expense._id !== action.payload
        );
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.error.message ||
          "Could not delete expense";
      });
  },
});

export default expenseSlice.reducer;