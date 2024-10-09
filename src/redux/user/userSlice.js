import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   user: null,
   isLoading: false,
   error: null,
};

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setUser: (state, action) => {
         state.user = action.payload;
         state.isLoading = false;
         state.error = null;
      },
      setLoading: (state, action) => {
         state.isLoading = action.payload;
      },
      clearUser: (state) => {
         state.user = null;
         state.error = null;
      },
      // setConnections: (state, action) => {
      //    if (state.user) {
      //       state.user.followers = action.payload.followers;
      //       state.user.following = action.payload.following;
      //    }
      // },
      setError: (state, action) => {
         state.error = action.payload;
         state.isLoading = false;
      },
   },
});

export const { setUser, setLoading, clearUser, setError } = userSlice.actions;
export default userSlice.reducer;
