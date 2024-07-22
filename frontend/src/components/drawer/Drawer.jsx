import React from "react";
import { categories } from "../../constants";
import { Button } from "../shared";
import { useDispatch, useSelector } from "react-redux";
import {
  setJobs,
  setSuccess,
  setFilterParams,
  filterJobs
} from "../../feature/jobs/jobSlice";
import { setAuth, logout } from "../../feature/auth/authSlice";

const Drawer = ({ isOpen, onClose }) => {
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
      await dispatch(filterJobs(filterParams)).unwrap();
      onClose();
    } catch (error) {
      console.log(error);
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
    onClose();
  };

  const handleSignout = async () => {
    try {
      const { data } = await logout();
      localStorage.removeItem("token");
      dispatch(setAuth(data));
    } catch (error) {
      console.log(error);
    }
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(5px)",
    zIndex: 1040,
  };

  const drawerStyle = {
    position: "fixed",
    top: 0,
    left: isOpen ? 0 : "-100%",
    width: "300px",
    height: "100%",
    backgroundColor: "#323232",
    zIndex: 1050,
    transition: "left 0.3s ease-in-out",
  };

  return (
    <>
      {isOpen && <div style={overlayStyle} onClick={onClose} />}
      <div style={drawerStyle}>
        <div className="h-full flex flex-col justify-between text-white-300 text-xl">
          <div className="flex flex-col items-start px-4">
            <h3 className="w-full px-10 font-bold my-4 text-3xl">Categories</h3>
            {categories.map((item) => (
              <div className="px-10 w-full flex flex-col items-start" key={item.id}>
                <h3 className="text-green-550 font-bold text-[18px]">{item.title}</h3>
                <ul className="flex flex-col items-start">
                  {item.options.map((option) => (
                    <li className="pr-2" key={option.id}>
                      <div className="flex items-center">
                        <input
                          id={`radio-${item.name}-${option.id}`}
                          type="radio"
                          value={option.optionValue}
                          name={item.name}
                          onChange={() => handleChange(item.name, option.optionValue)}
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
            <div className="mt-10 flex justify-between items-center gap-4 text-white-300 px-10">
              <Button content="Apply" handleInput={() => handleSubmit(filterParams)} />
              <button
                type="submit"
                className="text-white bg-blue-500 hover:bg-green-400 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 px-10 text-lg py-3 font-semibold">
            <div className="cursor-pointer">
              <span className="flex items-center whitespace-nowrap" id="basic-addon2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-white-300 hover:text-gray-300 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
              </span>
            </div>
            <p className="text-white-300" onClick={handleSignout}>Signout</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
