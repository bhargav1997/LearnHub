import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   events: [],
};

const calendarSlice = createSlice({
   name: "calendar",
   initialState,
   reducers: {
      addEvent: (state, action) => {
         state.events.push(action.payload);
      },
      setEvents: (state, action) => {
         state.events = action.payload;
      },
      updateEvent: (state, action) => {
         const index = state.events.findIndex(event => event.id === action.payload.id);
         if (index !== -1) {
            state.events[index] = action.payload;
         }
      },
      deleteEvent: (state, action) => {
         state.events = state.events.filter(event => event.id !== action.payload);
      },
   },
});

export const { addEvent, setEvents, updateEvent, deleteEvent } = calendarSlice.actions;
export default calendarSlice.reducer;
