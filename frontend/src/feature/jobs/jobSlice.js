import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL
const BASE_URL = 'http://localhost:8080/api/v1/job';

// Helper function to get the token from the state
const getToken = (getState) => getState().auth.token;

// Initial state
const initialState = {
  jobs: [],
  loading: false,
  error: null,
  success: null,
  filterParams: {
    status: 'all',
    workType: 'all',
    sort: 'latest',
    page: 1,
    search: '',
  },
};

// Thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    try {
      const response = await axios.get(`${BASE_URL}/get-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    try {
      const response = await axios.post(`${BASE_URL}/create-job`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    try {
      await axios.delete(`${BASE_URL}/delete-job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return jobId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const filterJobs = createAsyncThunk(
  'jobs/filterJobs',
  async (params, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    try {
      const response = await axios.get(`${BASE_URL}/get-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      return response.data; // Make sure the data contains 'jobs'
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async (jobData, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    try {
      const response = await axios.put(`${BASE_URL}/update-job/${jobData.id}`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    resetSearch: (state) => {
      state.filterParams = {
        status: 'all',
        workType: 'all',
        sort: 'latest',
        page: 1,
        search: '',
      };
    },
    setFilterParams: (state, action) => {
      state.filterParams = { ...state.filterParams, ...action.payload };
    },
    setJobs: (state, action) => {
      if (action.payload && action.payload.jobs) {
        state.jobs = action.payload.jobs;
      } else {
        console.warn("Payload doesn't have 'jobs' property:", action.payload);
      }
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload.job);
        state.success = 'Job created successfully';
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
        state.success = 'Job deleted successfully';
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(filterJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(filterJobs.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.jobs) {
          state.jobs = action.payload.jobs;
        } else {
          console.warn("Payload doesn't have 'jobs' property:", action.payload);
        }
      })
      .addCase(filterJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const updatedJob = action.payload.job;
        state.jobs = state.jobs.map(job =>
          job._id === updatedJob._id ? updatedJob : job
        );
        state.success = 'Job updated successfully';
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSearch, setFilterParams, setJobs, setSuccess } = jobsSlice.actions;
export default jobsSlice.reducer;
