import React from "react";
import { Button } from "../shared";
import { categories } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import {
  setJobs,
  setSuccess,
  setFilterParams,
  filterJobs,
} from "../../feature/jobs/jobSlice";

const Category = () => {
  const dispatch = useDispatch();
  const filterParams = useSelector((state) => state.jobs.filterParams);

  const handleChange = (name, value) => {
    const updatedFilterParams = {
      ...filterParams,
      page: 1,
      [name]: value,
    };
    dispatch(setFilterParams(updatedFilterParams));
  };

  const handleSubmit = async (filterParams) => {
    try {
      const actionResult = await dispatch(filterJobs(filterParams));
      if (filterJobs.fulfilled.match(actionResult)) {
        dispatch(setSuccess(actionResult.payload));
        dispatch(setJobs(actionResult.payload));
      } else {
        throw new Error(actionResult.payload || 'Filtering jobs failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClear = () => {
    const updatedParams = {
      status: "all",
      workType: "all",
      sort: "latest",
      page: 1,
      search: "",
    };
    dispatch(setFilterParams(updatedParams));
    handleSubmit(updatedParams);
  };

  return (
    <div className="hidden sm:flex items-center justify-center pt-28">
      <div className="flex items-center flex-col py-5 lg:py-0 md:gap-8 2xl:gap-12 w-full h-[380px] lg:h-[250px] mx-4 md:mx-16 bg-black-700">
        <div className="flex flex-col lg:pt-12 lg:flex-row gap-2 items-center lg:items-start justify-evenly w-full">
          {categories.map((item) => (
            <div className="flex flex-col items-center px-10" key={item.id}>
              <h3 className="text-green-550 font-bold text-[18px]">{item.title}</h3>
              <ul className="flex flex-wrap items-center">
                {item.options.map((option) => (
                  <li className="pr-2" key={option.id}>
                    <div className="flex items-center">
                      <input
                        id={`radio-${item.name}-${option.id}`}
                        type="radio"
                        value={option.optionValue}
                        name={item.name}
                        onChange={() =>
                          handleChange(item.name, option.optionValue)
                        }
                        checked={
                          option.optionValue ===
                          (item.name === "status"
                            ? filterParams.status
                            : item.name === "workType"
                            ? filterParams.workType
                            : filterParams.sort)
                        }
                        className="w-4 h-4 cursor-pointer"
                      />
                      <label
                        htmlFor={`radio-${item.name}-${option.id}`}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-300"
                      >
                        {option.optionTitle}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center gap-4 text-white-300">
          <Button content="Apply Filter" handleInput={() => handleSubmit(filterParams)} />
          <button
            type="button"
            className="text-white bg-blue-500 hover:bg-green-400 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default Category;
