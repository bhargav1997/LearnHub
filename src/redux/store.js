import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./example/exampleSlice";
import userReducer from "./user/userSlice";

const store = configureStore({
   reducer: {
      example: exampleReducer,
      user: userReducer,
   },
});

export default store;
