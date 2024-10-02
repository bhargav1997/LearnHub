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
});

export default store;
