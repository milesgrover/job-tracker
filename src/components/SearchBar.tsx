import { useEffect, useState } from "react";
import useSWR from "swr";

interface SearchBarProps {
  searchString: string;
  setSearchString: (str: string) => void;
}
export const SearchBar: React.FC<SearchBarProps> = ({
  searchString,
  setSearchString,
}) => {
  const { data: jobs, isLoading } = useSWR("/api/jobs");
  const [localSearch, setLocalSearch] = useState(searchString);
  const disabled = !jobs || isLoading;
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };
  const handleClear = () => {
    setLocalSearch("");
  };

  // using local state makes the input snappy
  // after input changes, send the update to parent to do what it needs to do
  useEffect(() => {
    setSearchString(localSearch);
  }, [localSearch]);
  return (
    <div className="flex place-items-center relative justify-self-start">
      <input
        name="search"
        id="search"
        placeholder="search..."
        className="bg-white p-4 pr-15 text-black disabled:bg-gray-400 disabled:text-gray-500"
        onChange={handleSearch}
        disabled={disabled}
        value={localSearch}
      />
      {localSearch && (
        <button
          className="p-4 bg-background active:translate-y-1 absolute right-2"
          onClick={handleClear}
        >
          <div className="icon-base icon-cancel bg-foreground"></div>
        </button>
      )}
    </div>
  );
};
