"use client";
import React from "react";

interface Props {
  user: {
    updated_at: string;
    username: string;
    name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

const AccountInfo: React.FC<Props> = ({ user }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-sm mx-auto">
      <div className="flex justify-center mb-4">
        <img
          src={user.avatar_url || "https://placekitten.com/300/300"}
          alt="Profile Avatar"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>
      <div className="text-center">
        <p className="text-xl font-semibold">{user.name} {user.last_name}</p>
        <p className="text-gray-600">@{user.username}</p>
        <p className="text-gray-500 text-sm">
          Updated: {new Date(user.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default AccountInfo;
