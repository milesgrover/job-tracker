"use client";
import { AddStatus } from "@/components/AddStatus";
import { ApplicationsTable } from "@/components/ApplicationsTable";
import { NewJobForm } from "@/components/NewJobForm";
import { useState } from "react";
import useSWR from "swr";
import { SearchBar } from "@/components/SearchBar";
import { Jobject } from "@/types/jobs";
import { JobsToday } from "@/components/JobsToday";

export default function Home() {
  const { data: jobs, mutate, error, isLoading } = useSWR("/api/jobs");

  const [addingStatusId, setAddingStatusId] = useState<number | null>(null);
  const [searchString, setSearchString] = useState("");

  const sortNewest = (a: Jobject, b: Jobject) => {
    const newest =
      new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime();
    if (newest === 0) {
      // if the dates are the same, sort by id
      return b.id - a.id;
    }
    return newest;
  };

  const filteredJobs = jobs
    ?.filter((job: Jobject) => {
      return (
        job.company?.toLowerCase().includes(searchString.toLowerCase()) ||
        job.title?.toLowerCase().includes(searchString.toLowerCase())
      );
    })
    .sort(sortNewest);

  return (
    <div className="font-body grid place-items-center h-full">
      <AddStatus id={addingStatusId} setAddingStatusId={setAddingStatusId} />
      <JobsToday />
      <div className="mx-20 max-w-7xl w-full">
        <h1 className="font-display text-8xl text-pink-500 text-center mb-10">
          Job Prospects
        </h1>
        <h2 className="font-display text-6xl text-sky-500">Add New</h2>
        <NewJobForm />
        <div className="grid grid-cols-2">
          <h2 className="font-display text-6xl text-sky-500">Applications</h2>
          <SearchBar
            searchString={searchString}
            setSearchString={setSearchString}
            disabled={!jobs || isLoading}
          />
        </div>
        <ApplicationsTable
          filteredJobs={filteredJobs}
          setAddingStatusId={setAddingStatusId}
        />
      </div>
    </div>
  );
}
