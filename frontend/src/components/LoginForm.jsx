import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../feature/auth/authSlice"; // Ensure this path is correct
import { isValidEmail } from "../utils/index";
import { enqueueSnackbar } from "notistack";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      enqueueSnackbar("Please fill all the fields!", {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!isValidEmail(email)) {
      enqueueSnackbar("Please enter a valid email!", {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="max-w-sm p-4 rounded-lg sm:p-6 md:p-8 bg-black-700 w-[100%]">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h5 className="text-xl font-medium text-white text-center">
          Sign in to our platform
        </h5>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
            Your email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="block w-full px-4 py-2 text-sm border rounded-lg bg-gray-700 border-gray-600 text-gray-300 focus:ring-blue-500 focus:border-blue-500"
           
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
            Your password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="block w-full px-4 py-2 text-sm border rounded-lg bg-gray-700 border-gray-600 text-gray-300 focus:ring-blue-500 focus:border-blue-500"
           
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-700 focus:ring-blue-500 focus:ring-offset-gray-800"
            />
            <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-300">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-indigo-500 hover:underline">
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
        <div className="text-sm font-medium text-gray-300">
          Not registered? 
          <Link to="/register" className="ml-1 text-indigo-500 hover:underline">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
