import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   currentUser: null,
   isLoading: true,
};

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setUser: (state, action) => {
         state.currentUser = action.payload;
         state.isLoading = false;
      },
      clearUser: (state) => {
         state.currentUser = null;
         state.isLoading = false;
      },
      setLoading: (state, action) => {
         state.isLoading = action.payload;
      },
   },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
