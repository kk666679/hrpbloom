"use client";

export { AgentTaskType } from "@/types/ai-agents";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAuthToken } from "@/lib/auth";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
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

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch job details");
        }
        const data = await res.json();
        setJob(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    async function fetchUser() {
      const authUser = getAuthToken();
      setUser(authUser);
    }
    if (jobId) fetchJob();
    fetchUser();
  }, [jobId]);

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <div className="mb-4">
        <p className="text-lg text-gray-600">
          {job.department ? `${job.department} - ` : ""}
          {job.location}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Employer: {job.employer.firstName} {job.employer.lastName}{" "}
          {job.employer.employerCompanyName ? `(${job.employer.employerCompanyName})` : ""}
        </p>
        <p className="text-sm text-gray-500">
          Company: {job.company?.name || "N/A"}
        </p>
        <p className="mt-2 font-medium">
          Salary:{" "}
          {job.salaryMin && job.salaryMax
            ? `RM${job.salaryMin.toLocaleString()} - RM${job.salaryMax.toLocaleString()}`
            : "Not specified"}
        </p>
        <p className="mt-1">Type: {job.type}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Job Description</h2>
        <p>{job.description}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Requirements</h2>
        <p>{job.requirements}</p>
      </div>
      {user && user.role !== 'admin' && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Apply Now
        </button>
      )}
      {user && user.role === 'admin' && (
        <p className="text-gray-500">Admins cannot apply for jobs.</p>
      )}
    </div>
  );
}
