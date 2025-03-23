import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/axiosClient";

export const fetchGroups = createAsyncThunk("groups/fetchGroups", async () => {
  const response = await api.getGroups();
  return response.data;
});

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (groupData) => {
    const response = await api.createGroup(groupData);
    return response.data;
  }
);

const groupsSlice = createSlice({
  name: "groups",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default groupsSlice.reducer;
