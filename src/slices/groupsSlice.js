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

export const updateGroup = createAsyncThunk(
  "groups/updateGroup",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await api.updateGroup(id, name);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteGroup(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
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
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        const index = state.items.findIndex((g) => g.id === updatedGroup.id);
        if (index !== -1) state.items[index] = updatedGroup;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.items = state.items.filter((g) => g.id !== deletedId);
      });
  },
});

export const { setSelectedGroupId } = groupsSlice.actions;
export default groupsSlice.reducer;
