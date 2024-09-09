import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./example/exampleSlice";

const store = configureStore({
   reducer: {
      example: exampleReducer,
   },
});

export default store;
