import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createLearningTask } from "../../service/taskService";

export const addLearningTask = createAsyncThunk("learningJourney/addLearningTask", async (taskData, { rejectWithValue }) => {
   try {
      const response = await createLearningTask(taskData);
      return response;
   } catch (error) {
      return rejectWithValue(error.message);
   }
});

const learningJourneySlice = createSlice({
   name: "learningJourney",
   initialState: {
      tasks: [],
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(addLearningTask.pending, (state) => {
            state.loading = true;
         })
         .addCase(addLearningTask.fulfilled, (state, action) => {
            state.loading = false;
            state.tasks.push(action.payload);
         })
         .addCase(addLearningTask.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         });
   },
});

export default learningJourneySlice.reducer;
