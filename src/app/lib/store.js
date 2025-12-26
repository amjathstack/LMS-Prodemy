"use client";
import { configureStore } from "@reduxjs/toolkit";
import componentReducer from "../lib/features/componentStatusSlice";
import coursesReducer from "../lib/features/coursesSlice";
import usersReducer from "../lib/features/usersSlice";

export const store = configureStore({
  reducer: {
    component: componentReducer,
    courses: coursesReducer,
    users: usersReducer,
  },
});
