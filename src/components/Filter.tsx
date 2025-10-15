interface FilterProps {
  setFilterMode: (str: FilterModes) => void;
}

export const enum FilterModes {
  ALL = "All",
  INTERVIEWING = "Interviewing",
  RECENT = "Recent",
  NOT_REJECTED = "Not rejected",
  REJECTED = "Rejected",
  REMOTE = "Remote",
  NOT_REMOTE = "Not Remote",
}

const filterOptions = [
  FilterModes.ALL,
  FilterModes.INTERVIEWING,
  FilterModes.RECENT,
  FilterModes.NOT_REJECTED,
  FilterModes.REJECTED,
  FilterModes.REMOTE,
  FilterModes.NOT_REMOTE,
];

export const Filter: React.FC<FilterProps> = ({ setFilterMode }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFilterMode(value as FilterModes);
  };
  return (
    <select
      name="filter"
      className="bg-white p-2 text-background justify-self-stretch h-full"
      onChange={handleSelectChange}
    >
      {filterOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
