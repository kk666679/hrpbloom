"use client";

import { useState } from "react";
import JobList from "@/components/job-portal/job-list";
import JobSearchForm from "@/components/job-portal/job-search-form";

export default function JobsPage() {
  const [filters, setFilters] = useState({
    searchTerm: "",
    location: "",
    jobType: "",
  });

  const handleSearch = (newFilters: { searchTerm: string; location: string; jobType: string }) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      <JobSearchForm onSearch={handleSearch} />
      <JobList filters={filters} />
    </div>
  );
}
