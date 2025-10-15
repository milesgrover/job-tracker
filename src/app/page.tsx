"use client";
import { AddStatus } from "@/components/AddStatus";
import { ApplicationsTable } from "@/components/ApplicationsTable";
import { NewJobForm } from "@/components/NewJobForm";
import { useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Jobject, JobWithEvents } from "@/types/jobs";
import { JobsToday } from "@/components/JobsToday";
import { SearchBar } from "@/components/SearchBar";
import {
  Sort,
  sortCompanyAZ,
  sortCompanyZA,
  sortLocation,
  SortModes,
  sortNewest,
  sortOldest,
  sortUpdated,
} from "@/components/Sort";
import { Filter, FilterModes } from "@/components/Filter";
import { useFilter } from "@/hooks/useFilter";

export default function Home() {
  const { data: jobs, mutate, error, isLoading } = useSWR("/api/jobs");
  const { cache } = useSWRConfig();

  const [addingStatusId, setAddingStatusId] = useState<number | null>(null);
  const [searchString, setSearchString] = useState("");
  const [sortMode, setSortMode] = useState(SortModes.NEWEST);
  const [filterMode, setFilterMode] = useState(FilterModes.ALL);

  const sortFunctions = {
    [SortModes.NEWEST]: sortNewest,
    [SortModes.OLDEST]: sortOldest,
    [SortModes.UPDATED]: sortUpdated,
    [SortModes.LOCATION]: sortLocation,
    [SortModes.COMPANY_A_Z]: sortCompanyAZ,
    [SortModes.COMPANY_Z_A]: sortCompanyZA,
  };

  const {
    filterAll,
    filterInterviewing,
    filterRecent,
    filterNotRejected,
    filterRejected,
    filterRemote,
    filterNotRemote,
  } = useFilter(searchString);

  const filterFunctions = {
    [FilterModes.ALL]: filterAll,
    [FilterModes.INTERVIEWING]: filterInterviewing,
    [FilterModes.RECENT]: filterRecent,
    [FilterModes.NOT_REJECTED]: filterNotRejected,
    [FilterModes.REJECTED]: filterRejected,
    [FilterModes.REMOTE]: filterRemote,
    [FilterModes.NOT_REMOTE]: filterNotRemote,
  };

  const filteredJobs = useMemo(() => {
    return jobs
      ?.map((job: Jobject) => {
        // add the events to each job to make sorting and filtering easier
        const events = cache.get(`/api/events?job_id=${job.id}`)?.data;
        return { ...job, events: [...events] };
      })
      .filter(filterFunctions[filterMode])
      .sort(sortFunctions[sortMode]);
  }, [JSON.stringify(jobs), sortMode, searchString, filterMode]);

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
          <div className="text-xs justify-self-end self-center">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        </div>
        <div className="grid grid-cols-[2fr_1fr_1fr] my-4 gap-4">
          <SearchBar
            searchString={searchString}
            setSearchString={setSearchString}
          />
          <Sort setSortMode={setSortMode} />
          <Filter setFilterMode={setFilterMode} />
        </div>
        <ApplicationsTable
          filteredJobs={filteredJobs}
          setAddingStatusId={setAddingStatusId}
        />
      </div>
    </div>
  );
}
