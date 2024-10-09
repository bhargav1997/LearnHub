// import { fetchUserConnections } from "../../api/userApi";
// import { setUser, clearUser, setLoading, setConnections, setError } from "./userSlice";
import { setUser, clearUser } from "./userSlice";

export const getUser = (user) => async (dispatch) => {
   dispatch(setUser(user));
};

export const deleteUser = () => async (dispatch) => {
   dispatch(clearUser());
};

// export const fetchConnections = () => async (dispatch) => {
//    dispatch(setLoading(true));
//    try {
//       const data = await fetchUserConnections();
//       dispatch(setConnections(data));
//    } catch (error) {
//       console.error("Error fetching connections:", error);
//       dispatch(setError(error.message));
//    } finally {
//       dispatch(setLoading(false));
//    }
// };
