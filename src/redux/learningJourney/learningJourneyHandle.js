import {
   setJourneys,
   addJourney,
   updateJourney as updateJourneyAction,
   setSelectedJourney,
   deleteJourney as deleteJourneyAction,
   loadJourneysFromStorage,
} from "./learningJourneySlice";
import * as api from "../../service/learningJourneyService";

// Helper function to save journeys to local storage
// const saveJourneysToStorage = (journeys) => {
//    localStorage.setItem("learningJourneys", JSON.stringify(journeys));
// };

export const getJourneysToUser = () => async (dispatch) => {
   try {
      const response = await api.fetchJourneys();
      dispatch(setJourneys(response.data));
   } catch (error) {
      console.error("Error fetching journeys:", error);
   }
};

export const loadJourneysFromLocalStorage = () => (dispatch) => {
   dispatch(loadJourneysFromStorage());
};

export const addJourneyToUser = (journey) => async (dispatch) => {
   try {
      const response = await api.createJourney(journey);
      dispatch(addJourney(response.data));
   } catch (error) {
      console.error("Error creating journey:", error);
   }
};

export const updateJourneyToUser = (journey) => async (dispatch) => {
   try {
      const response = await api.updateJourney(journey._id, journey);
      dispatch(updateJourneyAction(response.data));
   } catch (error) {
      console.error("Error updating journey:", error);
   }
};

export const setSelectedJourneyToUser = (journeyId) => async (dispatch) => {
   try {
      if (journeyId) {
         const response = await api.fetchJourney(journeyId);
         dispatch(setSelectedJourney(response.data));
      } else {
         dispatch(setSelectedJourney(null));
      }
   } catch (error) {
      console.error("Error fetching selected journey:", error);
   }
};

export const deleteJourneyFromUser = (journeyId) => async (dispatch) => {
   try {
      await api.deleteJourney(journeyId);
      dispatch(deleteJourneyAction(journeyId));
   } catch (error) {
      console.error("Error deleting journey:", error);
   }
};
