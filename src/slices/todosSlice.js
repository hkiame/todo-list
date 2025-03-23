import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/axiosClient";

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const response = await api.getTodos();
  return response;
});

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (todoData) => {
    const response = await api.createTodo(todoData);
    return response.data;
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, todoData }) => {
    const response = await api.updateTodo(id, todoData);
    return response.data;
  }
);

export const deleteTodo = createAsyncThunk("todos/deleteTodo", async (id) => {
  await api.deleteTodo(id);
  return id;
});

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Todos
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Create Todo
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update Todo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      });
  },
});

export default todosSlice.reducer;
