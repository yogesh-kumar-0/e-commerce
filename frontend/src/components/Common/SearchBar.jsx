import React from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductsByFilters, setFilters } from "../../redux/slice/productSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const dispatch =  useDispatch();
  const navigate = useNavigate();
  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };
  const handelSearch =(e)=>{
    e.preventDefault();
    dispatch(setFilters({search: searchTerm}));

    dispatch(fetchProductsByFilters({search: searchTerm}));
    navigate(`/collections/all?search=${searchTerm}`);

    setIsOpen(false);
    setSearchTerm("");
  }

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen
          ? " absolute top-0 left-0 w-full bg-white h-24 z-50 "
          :  "w-auto"
      }`}
    >
      {isOpen ? (
        <form onSubmit={handelSearch} className="relative flex items-center justify-center w-full">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" bg-grey-100 px-4 py-2 pl-2 rounded-lg outline-1 focus:outline-none w-full placeholder:text-grey-700"
            />
            {/* search icon */}
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-grey-600 hover:text-grey-800">
                <HiMagnifyingGlass className="h-6 w-6 " />
            </button>
          </div>
          {/* close button */}
          <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-grey-600 hover:text-grey-800" onClick={handleSearchToggle}>
            <HiMiniXMark className="h-6 w-6"/>
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
