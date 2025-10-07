interface SearchBarProps {
  searchString: string;
  setSearchString: (str: string) => void;
  disabled: boolean;
}
export const SearchBar: React.FC<SearchBarProps> = ({
  searchString,
  setSearchString,
  disabled,
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };
  return (
    <div className="justify-self-end flex place-items-center">
      <input
        name="search"
        id="search"
        placeholder="search..."
        className="bg-white p-4 text-black disabled:bg-gray-400 disabled:text-gray-500"
        onChange={handleSearch}
        disabled={disabled}
      />
    </div>
  );
};
