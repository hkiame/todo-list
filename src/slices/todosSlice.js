// src/slices/todosSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/axiosClient";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await api.getTodos();
      const todos = response;
      const { items: groups } = getState().groups;

      return todos.map((todo) => {
        const group = groups.find((g) => g.id === todo.groupId);
        const ungrouped = groups.find(
          (g) => g.name.toLocaleLowerCase() === "ungrouped"
        );
        return {
          ...todo,
          groupName: group ? group.name : "ungrouped",
          groupId: group ? group.id : ungrouped.id,
          createdDate: todo.createdDate || null,
        };
      });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (todoData, { rejectWithValue }) => {
    try {
      const response = await api.createTodo({
        ...todoData,
        createdDate: new Date().toISOString(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (todoData) => {
    const response = await api.updateTodo(todoData.id, todoData); // Assumes PATCH or PUT
    return response;
  }
);

export const deleteTodo = createAsyncThunk("todos/deleteTodo", async (id) => {
  await api.deleteTodo(id); // Assumes DELETE endpoint
  return id;
});

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        console.log("updateTodo fulfilled:", action.payload);
        const index = state.items.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      });
  },
});

export default todosSlice.reducer;
