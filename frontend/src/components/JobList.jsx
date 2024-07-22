import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../src/feature/jobs/jobSlice';

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  return (
    <div>
      {loading && <p>Loading jobs...</p>}
      {error && <p>{error.message}</p>}
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            <h3>{job.position}</h3>
            <p>{job.company}</p>
            <p>{job.workLocation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
