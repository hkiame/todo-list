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
        return {
          ...todo,
          groupName: group ? group.name : "Ungrouped",
          createdDate: todo.createdDate || null,
        };
      });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const createTodo = createAsyncThunk(
//   "todos/createTodo",
//   async (todoData, { getState }) => {
//     const { groups } = getState();
//     const ungroupedId =
//       groups.ungroupedId || "660e8400-e29b-41d4-a716-446655441111";
//     const normalizedTodo = {
//       ...todoData,
//       group: todoData.group || ungroupedId,
//       createdDate: formatISO(new Date()),
//     };
//     const response = await api.createTodo(normalizedTodo);
//     return response.data;
//   }
// );

// // Update an existing todo
// export const updateTodo = createAsyncThunk(
//   "todos/updateTodo",
//   async (todoData, { rejectWithValue }) => {
//     try {
//       const response = await axios.patch(`/api/todos/${todoData.id}`, todoData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Delete an existing todo
// export const deleteTodo = createAsyncThunk(
//   "todos/deleteTodo",
//   async (id, { rejectWithValue }) => {
//     try {
//       await axios.delete(`/api/todos/${id}`);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

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
