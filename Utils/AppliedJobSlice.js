import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for the applied job slice.
 * - `appliedJob`: Array to store the list of jobs applied by the user.
 * - `bookMark`: Array to store bookmarked jobs.
 */
const initialState = {
  appliedJob: [], // Stores jobs applied by the user
  bookMark: [],   // Stores jobs bookmarked by the user
};

/**
 * Slice for managing applied jobs and bookmarks in the application state.
 */
export const appliedJobSlice = createSlice({
  name: "AppliedJob", // Name of the slice
  initialState, // Initial state defined above
  reducers: {
    /**
     * Reducer to update the list of applied jobs.
     * 
     * @param {object} state - Current state of the slice.
     * @param {object} action - Redux action containing the payload with the new applied jobs list.
     */
    setAppliedJob: (state, action) => {
      state.appliedJob = action.payload; // Update appliedJob with new data
    },
    
    /**
     * Reducer to update the list of bookmarked jobs.
     * 
     * @param {object} state - Current state of the slice.
     * @param {object} action - Redux action containing the payload with the new bookmarks list.
     */
    setBookMark: (state, action) => {
      state.bookMark = action.payload; // Update bookMark with new data
    },
  },
});

// Exporting action creators for the reducers
export const { setAppliedJob, setBookMark } = appliedJobSlice.actions;

// Exporting the reducer to be used in the Redux store configuration
export const AppliedJobReducer = appliedJobSlice.reducer;
