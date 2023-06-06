interface Props {
  onClick: (title: string) => void;
}

const SearchBox = ({ onClick }: Props) => {
  const handleClick = (onClick: (title: string) => void) => {
    const inputElement = document.getElementById(
      "search"
    ) as HTMLInputElement | null;
    if (inputElement) {
      onClick(inputElement.value);
    }
  };

  return (
    <div className="input-group">
      <input
        id="search"
        type="search"
        className="form-control rounded"
        placeholder="Search"
        aria-label="Search"
        aria-describedby="search-addon"
      />
      <button
        onClick={() => handleClick(onClick)}
        type="button"
        className="btn btn-outline-primary"
        id="searchbtn"
      >
        search
      </button>
    </div>
  );
};

export default SearchBox;
