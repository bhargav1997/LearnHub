import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./example/exampleSlice";
import userReducer from "./user/userSlice";
import learningJourneyReducer from "./learningJourney/learningJourneySlice";

const store = configureStore({
   reducer: {
      example: exampleReducer,
      user: userReducer,
      learningJourney: learningJourneyReducer,
   },
   // `thunk` is included by default, no need to add it manually.
});

export default store;
