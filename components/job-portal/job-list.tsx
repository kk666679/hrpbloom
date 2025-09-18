"use client";

import React, { useEffect, useState } from "react";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  department?: string;
  salaryMin?: number;
  salaryMax?: number;
  type: string;
  status: string;
  employer: {
    firstName: string;
    lastName: string;
    employerCompanyName?: string;
  };
  company?: {
    name: string;
  };
}

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await res.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-4">
      {jobs.length === 0 && <p>No jobs available.</p>}
      {jobs.map((job) => (
        <div key={job.id} className="border rounded p-4 shadow-sm">
          <h3 className="text-xl font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-600">
            {job.department ? `${job.department} - ` : ""}
            {job.location}
          </p>
          <p className="mt-2">{job.description}</p>
          <p className="mt-2 font-medium">
            Salary:{" "}
            {job.salaryMin && job.salaryMax
              ? `RM${job.salaryMin.toLocaleString()} - RM${job.salaryMax.toLocaleString()}`
              : "Not specified"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Employer: {job.employer.firstName} {job.employer.lastName}{" "}
            {job.employer.employerCompanyName ? `(${job.employer.employerCompanyName})` : ""}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Company: {job.company?.name || "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
}
