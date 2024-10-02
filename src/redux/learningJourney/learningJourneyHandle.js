import { setJourneys, addJourney, updateJourney, setSelectedJourney, clearJourneys } from "./learningJourneySlice";

export const getJourneysToUser = (journeys) => async (dispatch) => {
   dispatch(setJourneys(journeys));
};

export const deleteJourneysToUser = () => async (dispatch) => {
   dispatch(clearJourneys());
};

export const addJourneyToUser = (journey) => async (dispatch) => {
   dispatch(addJourney(journey));
};

export const updateJourneyToUser = (journey) => async (dispatch) => {
   dispatch(updateJourney(journey));
};

export const setSelectedJourneyToUser = (journey) => async (dispatch) => {
   dispatch(setSelectedJourney(journey));
};
