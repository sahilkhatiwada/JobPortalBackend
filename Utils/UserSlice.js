import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for the user slice.
 * - `userData`: Stores information about the authenticated user.
 * - `userToken`: Stores the user's authentication token.
 */
const initialState = {
  userData: null, // User information (e.g., name, email, roles)
  userToken: null, // Authentication token for the user (e.g., JWT)
};

/**
 * Slice for managing user-related state in the application.
 */
export const userSlice = createSlice({
  name: "User", // Name of the slice
  initialState, // Initial state defined above
  reducers: {
    /**
     * Reducer to update the user data.
     * 
     * @param {object} state - Current state of the slice.
     * @param {object} action - Redux action containing the payload with the new user data.
     */
    setUserData: (state, action) => {
      state.userData = action.payload; // Update userData with new information
    },

    /**
     * Reducer to update the user's authentication token.
     * 
     * @param {object} state - Current state of the slice.
     * @param {object} action - Redux action containing the payload with the new user token.
     */
    setUserToken: (state, action) => {
      state.userToken = action.payload; // Update userToken with the new token
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserData, setUserToken } = userSlice.actions;

// Exporting the reducer to be used in the Redux store configuration
export const UserReducer = userSlice.reducer;
