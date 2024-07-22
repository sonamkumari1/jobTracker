import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createJob } from '../../src/feature/jobs/jobSlice';

const JobForm = () => {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [workType, setWorkType] = useState('full-time'); // Default to 'full-time'
  const [workLocation, setWorkLocation] = useState('Mumbai'); // Default to 'Mumbai'
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.jobs);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createJob({ company, position, workType, workLocation }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company"
        required
      />
      <input
        type="text"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        placeholder="Position"
        required
      />
      <select value={workType} onChange={(e) => setWorkType(e.target.value)} required>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="internship">Internship</option>
        <option value="contract-based">Contract-based</option>
      </select>
      <input
        type="text"
        value={workLocation}
        onChange={(e) => setWorkLocation(e.target.value)}
        placeholder="Work Location"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Job'}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

export default JobForm;
