import JobList from "@/components/job-portal/job-list";

export default function JobsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      <JobList />
    </div>
  );
}
