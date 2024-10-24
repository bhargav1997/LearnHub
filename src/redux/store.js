import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./example/exampleSlice";
import userReducer from "./user/userSlice";
import learningJourneyReducer from "./learningJourney/learningJourneySlice";
import calendarReducer from "./calendar/calendarSlice";
import postsReducer from "./posts/postsSlice";

const store = configureStore({
   reducer: {
      example: exampleReducer,
      user: userReducer,
      learningJourney: learningJourneyReducer,
      calendar: calendarReducer,
      posts: postsReducer,
   },
});

export default store;
