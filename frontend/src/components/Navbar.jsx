import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../feature/auth/authSlice';
import Search from '../components/shared/Search'; // Correct path for Search component

const Navbar = ({ toggleDrawer }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      dispatch(logout()); // Dispatch the logout action
      // Optionally, redirect or show a success message here
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="fixed z-50 flex w-full flex-wrap items-center justify-between bg-black-700 py-2 text-neutral-500 shadow-lg hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600 lg:py-4">
      <div className="flex w-full flex-wrap items-center justify-between px-16">
        <Link to={token ? "/dashboard" : "/"}>
          <img
            src="/asset/logo/logo-no-background.png"
            alt="logo"
            height={80}
            width={80}
          />
        </Link>
        <div className="flex w-[30%] items-center sm:justify-between justify-end">
          <div className="hidden sm:flex items-center w-full">
            <Search />
          </div>
          <span className="flex sm:hidden items-center whitespace-nowrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-white-300 hover:text-gray-300 cursor-pointer"
              onClick={toggleDrawer}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </span>

          {token ? (
            <>
              <Link to="/dashboard" className="hidden sm:flex items-center whitespace-nowrap text-white-300 hover:text-gray-300">
                Dashboard
              </Link>
              <span
                className="input-group-text hidden sm:flex items-center whitespace-nowrap"
                id="basic-addon2"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-white-300 hover:text-gray-300 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
              </span>
            </>
          ) : (
            <>
              <Link to="/" className="text-white-300 hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="text-white-300 hover:text-gray-300 ml-4">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
