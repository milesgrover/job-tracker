import { EventType } from "@/types/events";
import { JobWithEvents } from "@/types/jobs";
import { isWithinLastDays } from "@/util";

export const useFilter = (searchString: string) => {
  const filterSearch = (job: JobWithEvents) => {
    return (
      job.company?.toLowerCase().includes(searchString.toLowerCase()) ||
      job.title?.toLowerCase().includes(searchString.toLowerCase())
    );
  };
  const filterAll = (job: JobWithEvents) => {
    return filterSearch(job);
  };
  const filterInterviewing = (job: JobWithEvents) => {
    const eventsLength = job.events.length;
    if (!eventsLength) return false;
    const latestStatus = job.events[eventsLength - 1].event_type;
    const interviewingStatus =
      latestStatus !== EventType.Rejected && latestStatus !== EventType.Applied;
    return filterSearch(job) && interviewingStatus;
  };
  const filterRecent = (job: JobWithEvents) => {
    const appliedDate = new Date(job.applied_date);
    if (!job.events.length) {
      return filterSearch(job) && isWithinLastDays(appliedDate, 30);
    }
    const latestEventDate = new Date(job.events.at(-1)!.event_date);
    return (
      filterSearch(job) &&
      (isWithinLastDays(appliedDate, 30) ||
        isWithinLastDays(latestEventDate, 30))
    );
  };
  const filterNotRejected = (job: JobWithEvents) => {
    if (!job.events.length) return true;
    return (
      filterSearch(job) && job.events.at(-1)!.event_type !== EventType.Rejected
    );
  };
  const filterRejected = (job: JobWithEvents) => {
    if (!job.events.length) return false;
    return (
      filterSearch(job) && job.events.at(-1)!.event_type === EventType.Rejected
    );
  };
  const filterRemote = (job: JobWithEvents) => {
    return filterSearch(job) && job.location.toLowerCase() === "remote";
  };
  const filterNotRemote = (job: JobWithEvents) => {
    return filterSearch(job) && job.location.toLowerCase() !== "remote";
  };
  return {
    filterAll,
    filterInterviewing,
    filterRecent,
    filterNotRejected,
    filterRejected,
    filterRemote,
    filterNotRemote,
  };
};
