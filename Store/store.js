// Importing the necessary functions and reducers
import { configureStore } from "@reduxjs/toolkit"; // configureStore sets up a Redux store with a single function
import { UserReducer } from "@/Utils/UserSlice"; // Manages user-related state
import { JobReducer } from "@/Utils/JobSlice"; // Manages job-related state
import { AppliedJobReducer } from "@/Utils/AppliedJobSlice"; // Manages state for applied jobs

// Configuring the Redux store
export const store = configureStore({
  reducer: {
    // User: Handles the state related to user information and authentication
    User: UserReducer, 
    
    // Job: Handles the state related to job postings and listings
    Job: JobReducer, 
    
    // AppliedJob: Manages the state for jobs applied by the user
    AppliedJob: AppliedJobReducer,
  },
});
