import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/axiosClient";

export const fetchGroups = createAsyncThunk("groups/fetchGroups", async () => {
  const response = await api.getGroups();
  return response;
});

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (groupData) => {
    const response = await api.createGroup(groupData);
    return response;
  }
);

const groupsSlice = createSlice({
  name: "groups",
  initialState: {
    items: [],
    selectedGroupId: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setSelectedGroupId: (state, action) => {
      state.selectedGroupId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        // Find Ungrouped ID dynamically
        const ungroupedGroup = action.payload.find(
          (g) => g.name.toLocaleLowerCase() === "ungrouped"
        );
        state.ungroupedId = ungroupedGroup ? ungroupedGroup.id : null;
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

export const { setSelectedGroupId } = groupsSlice.actions;
export default groupsSlice.reducer;
