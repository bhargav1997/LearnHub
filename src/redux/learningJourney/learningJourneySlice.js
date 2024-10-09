import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   journeys: [],
   selectedJourney: null,
};

const learningJourneySlice = createSlice({
   name: "learningJourney",
   initialState,
   reducers: {
      setJourneys: (state, action) => {
         state.journeys = action.payload;
      },
      addJourney: (state, action) => {
         state.journeys.push(action.payload);
      },
      updateJourney: (state, action) => {
         const index = state.journeys.findIndex((journey) => journey.id === action.payload.id);
         if (index !== -1) {
            state.journeys[index] = action.payload;
            state.selectedJourney = action.payload;
         }
      },
      setSelectedJourney: (state, action) => {
         state.selectedJourney = action.payload;
      },
      clearJourneys: (state) => {
         state.journeys = [];
      },
      deleteJourney: (state, action) => {
         state.journeys = state.journeys.filter(journey => journey.id !== action.payload);
         if (state.selectedJourney && state.selectedJourney.id === action.payload) {
            state.selectedJourney = null;
         }
      },
   },
});

export const { setJourneys, addJourney, updateJourney, setSelectedJourney, clearJourneys, deleteJourney } = learningJourneySlice.actions;
export default learningJourneySlice.reducer;
