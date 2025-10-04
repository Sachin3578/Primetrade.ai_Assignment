import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-white to-yellow-100">
      <div className="max-w-sm w-full bg-white/70 backdrop-blur-md border border-blue-300 rounded-2xl p-6 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <img
            src="/landing-illustration.png"
            alt="Task Management"
            className="w-56 h-56 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Task Management & <br /> To-Do List
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6">
          This productive tool is designed to help you better manage your task
          project-wise conveniently!
        </p>

        {/* Button */}
        <button
          onClick={handleStart}
          className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Let’s Start
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
