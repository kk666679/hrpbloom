"use client";

import { useState } from "react";

interface JobSearchFormProps {
  onSearch: (filters: {
    searchTerm: string;
    location: string;
    jobType: string;
  }) => void;
}

export default function JobSearchForm({ onSearch }: JobSearchFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const handleSearch = () => {
    onSearch({ searchTerm, location, jobType });
  };

  return (
    <div className="p-4 border rounded mb-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Find Your Dream Job</h2>
      <input
        type="text"
        placeholder="Search by job title, company..."
        className="p-2 border border-gray-300 rounded w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        className="p-2 border border-gray-300 rounded w-full mb-4"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <select
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full mb-4"
      >
        <option value="">Job Type</option>
        <option value="FULL_TIME">Full-Time</option>
        <option value="PART_TIME">Part-Time</option>
        <option value="REMOTE">Remote</option>
      </select>
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
      >
        Search Jobs
      </button>
    </div>
  );
}
