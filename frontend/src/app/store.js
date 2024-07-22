import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../feature/auth/authSlice';
import jobsReducer from '../feature/jobs/jobSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer
  }
});

export default store;