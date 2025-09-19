"use client";

import { useState, useEffect } from "react";

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
}

export default function EmployerPortalPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    department: "",
    salaryMin: "",
    salaryMax: "",
    type: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/employer/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          salaryMin: form.salaryMin ? parseFloat(form.salaryMin) : null,
          salaryMax: form.salaryMax ? parseFloat(form.salaryMax) : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create job");
      setForm({
        title: "",
        description: "",
        location: "",
        department: "",
        salaryMin: "",
        salaryMax: "",
        type: "",
      });
      fetchJobs();
    } catch (err: any) {
      alert(err.message || "Unknown error");
    }
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Employer Job Management</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block mb-1 font-semibold">Job Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Department</label>
          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Salary Min</label>
          <input
            type="number"
            name="salaryMin"
            value={form.salaryMin}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Salary Max</label>
          <input
            type="number"
            name="salaryMax"
            value={form.salaryMax}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Job Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select type</option>
            <option value="FULL_TIME">Full-Time</option>
            <option value="PART_TIME">Part-Time</option>
            <option value="REMOTE">Remote</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Post Job
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Your Job Listings</h2>
      {jobs.length === 0 ? (
        <p>No job listings found.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p>{job.description}</p>
              <p>
                Location: {job.location} | Department: {job.department || "N/A"} | Type: {job.type}
              </p>
              <p>
                Salary:{" "}
                {job.salaryMin && job.salaryMax
                  ? `RM${job.salaryMin.toLocaleString()} - RM${job.salaryMax.toLocaleString()}`
                  : "Not specified"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
