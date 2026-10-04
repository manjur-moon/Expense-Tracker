"use client";

import {
  useState,
} from "react";

import {
  Provider,
} from "react-redux";

import {
  makeStore,
} from "@/redux/store";

import type {
  AppStore,
} from "@/redux/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState<AppStore>(
    () => makeStore()
  );

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}