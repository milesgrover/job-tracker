import { JobWithEvents } from "@/types/jobs";

export const enum SortModes {
  NEWEST = "Newest",
  OLDEST = "Oldest",
  UPDATED = "Updated",
  LOCATION = "Location",
  COMPANY_A_Z = "Company A-Z",
  COMPANY_Z_A = "Company Z-A",
}

interface SortProps {
  setSortMode: (str: SortModes) => void;
}

const sortOptions: SortModes[] = [
  SortModes.NEWEST,
  SortModes.OLDEST,
  SortModes.UPDATED,
  SortModes.LOCATION,
  SortModes.COMPANY_A_Z,
  SortModes.COMPANY_Z_A,
];

export const sortNewest = (a: JobWithEvents, b: JobWithEvents) => {
  const newest =
    new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime();
  if (newest === 0) {
    // if the dates are the same, sort by id
    return b.id - a.id;
  }
  return newest;
};

export const sortOldest = (a: JobWithEvents, b: JobWithEvents) => {
  const oldest =
    new Date(a.applied_date).getTime() - new Date(b.applied_date).getTime();
  if (oldest === 0) {
    // if the dates are the same, sort by id
    return a.id - b.id;
  }
  return oldest;
};

export const sortUpdated = (a: JobWithEvents, b: JobWithEvents) => {
  const latestAEvent = a.events[a.events.length - 1]?.event_date;
  const latestBEvent = b.events[b.events.length - 1]?.event_date;
  const timeA = latestAEvent
    ? new Date(latestAEvent).getTime()
    : new Date(a.applied_date).getTime();
  const timeB = latestBEvent
    ? new Date(latestBEvent).getTime()
    : new Date(b.applied_date).getTime();
  return timeB - timeA;
};

const sortAlphabetical = (a: string, b: string, ascending = true) => {
  const aNormalized = a.toLowerCase();
  const bNormalized = b.toLowerCase();
  if (ascending) {
    if (aNormalized < bNormalized) return -1;
    if (bNormalized < aNormalized) return 1;
  } else {
    if (aNormalized < bNormalized) return 1;
    if (bNormalized < aNormalized) return -1;
  }
  return 0;
};

export const sortLocation = (a: JobWithEvents, b: JobWithEvents) => {
  return sortAlphabetical(a.location, b.location);
};

export const sortCompanyAZ = (a: JobWithEvents, b: JobWithEvents) => {
  return sortAlphabetical(a.company, b.company);
};

export const sortCompanyZA = (a: JobWithEvents, b: JobWithEvents) => {
  return sortAlphabetical(a.company, b.company, false);
};

export const Sort: React.FC<SortProps> = ({ setSortMode }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSortMode(value as SortModes);
  };
  return (
    <select
      name="sort"
      className="bg-white p-2 text-background justify-self-stretch h-full"
      onChange={handleSelectChange}
    >
      {sortOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
