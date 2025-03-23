import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "@/slices/todosSlice";
import groupsReducer from "@/slices/groupsSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    groups: groupsReducer,
  },
});
