// src/pages/AuthOptions.js
import React from "react";
import { Link } from "react-router-dom";

const AuthOptions = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome!</h1>
      <p className="mb-6 text-gray-400">Please log in or sign up to continue.</p>
      <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out text-center"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out text-center"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default AuthOptions;