import { configureStore } from "@reduxjs/toolkit";

import expenseReducer from "@/redux/features/expenses/expenseSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      expenses: expenseReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];