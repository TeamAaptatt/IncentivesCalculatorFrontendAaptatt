import React from "react";

const UserCard = ({ user }) => {
  return (
      <div className="max-w-xs mx-2 my-4 bg-white rounded overflow-hidden shadow-lg cursor-pointer">
        <img className="w-full h-48 object-cover" src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1708560000&semt=ais" alt={user.name} />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{user.name}</div>
          <p className="text-gray-700 text-base">{user.email}</p>
        </div>
        <div className="px-6 pt-4 pb-2">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            {user.designation || "SSD-2"}
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            {user.status ||"Active"}
          </span>
        </div>
      </div>
  );
};

export default UserCard;
