"use client";
import React from "react";

const ChangePassword: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <form className="space-y-4">
        <input
          type="password"
          placeholder="Current password"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="New password"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-[#A35C7A] text-white py-2 rounded hover:bg-[#92486A]"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
