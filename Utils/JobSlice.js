import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for the job slice.
 * - `JobData`: Stores the details of all available jobs.
 * - `matchingData`: Stores jobs matching specific criteria.
 * - `myJobs`: Stores the jobs created or owned by the logged-in user.
 */
const initialState = {
  JobData: null, // General job data (e.g., job listings or fetched jobs)
  matchingData: null, // Data for jobs matching certain criteria
  myJobs: null, // Jobs owned/created by the user
};

/**
 * Slice for managing job-related data in the application state.
 */
export const jobSlice = createSlice({
  name: "Job", // Name of the slice
  initialState, // Initial state defined above
  reducers: {
    /**
     * Reducer to update general job data.
     * 
     * @param {object} state - Current state of the slice.
     * @param {object} action - Redux action containing the payload with the new job data.
     */
    setJobData: (state, action) => {
      state.JobData = action.payload; // Update JobData with new data
    },

    /**
     * Reducer to update jobs matching specific criteria.
     * 
     * @param {object} state - Current state of the slice.
     * @param {object} action - Redux action containing the payload with matching job data.
     */
    setMatchingJobData: (state, action) => {
      state.matchingData = action.payload; // Update matchingData with new data
    },

    /**
     * Reducer to update the user's owned or created jobs.
     * 
     * @param {object} state - Current state of the slice.
     * @param {object} action - Redux action containing the payload with the user's job data.
     */
    setMyJobs: (state, action) => {
      state.myJobs = action.payload; // Update myJobs with new data
    },
  },
});

// Action creators are generated for each reducer function
export const { setJobData, setMatchingJobData, setMyJobs } = jobSlice.actions;

// Exporting the reducer to be used in the Redux store configuration
export const JobReducer = jobSlice.reducer;
