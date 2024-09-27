import { setUser, clearUser } from "./userSlice";

export const getUser = (user) => async (dispatch) => {
   dispatch(setUser(user));
};

export const deleteUser = () => async (dispatch) => {
   dispatch(clearUser());
};
