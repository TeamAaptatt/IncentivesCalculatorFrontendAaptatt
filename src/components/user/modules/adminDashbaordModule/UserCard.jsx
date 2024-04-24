import React from "react";

const UserCard = ({ user }) => {
  return (
      <div className=" max-w-xs mx-2 my-4   bg-white rounded overflow-hidden flex-wrap flex shadow-lg cursor-pointer">
        <img className="w-2/3 object-cover " src="data:image/png;base64,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" alt={user.name} />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{user?.name}</div>
          <p className="text-gray-700 text-base">{user?.email}</p>
          
        </div>
        <div className="px-6 pt-4 pb-3">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            {user?.status}
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            {user?.cid}
          </span>
        </div>
      </div>
  );
};

export default UserCard;
