import { Jobject } from "@/types/jobs";
import useSWR from "swr";
import { ShowLoader } from "./ShowLoader";
import { useToday } from "@/hooks/useToday";

export const JobsToday = () => {
  const { data: jobs } = useSWR("/api/jobs");
  const today = useToday();
  const jobsToday = jobs?.filter(
    (j: Jobject) => j.applied_date.split("T")[0] === today
  );
  const count = jobsToday?.length ?? 0;
  const countColorScale = [
    "text-red-500",
    "text-orange-400",
    "text-amber-400",
    "text-yellow-300",
    "text-lime-300",
    "text-green-500",
  ];
  const jobCountStyle = () => {
    const normalizedCount = count <= 5 ? count : 5;
    return `${countColorScale[normalizedCount]} text-2xl`;
  };

  return (
    <div className="text-center fixed top-1 right-1 bg-background p-1">
      <div className="uppercase text-sm w-20">Jobs today</div>
      <ShowLoader>
        <div className={jobCountStyle()}>{count}</div>
      </ShowLoader>
    </div>
  );
};
