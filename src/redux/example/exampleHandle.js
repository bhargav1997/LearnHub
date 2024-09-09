import { increment } from "./exampleSlices";

export const getExample = (id) => async (dispatch) => {
   dispatch(increment(id));
};
