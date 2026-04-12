import React from "react";

const UserCard = ({ user, onViewDetails, onDelete }) => {
  return (
    <div className="user-card">
      <div className="user-card-top">
        <h3>{user.name}</h3>
        <span className="age-badge">Age: {user.age || "N/A"}</span>
      </div>

      <div className="card-buttons">
        <button className="view-btn" onClick={() => onViewDetails(user._id)}>
          View Details
        </button>

        <button className="delete-btn" onClick={() => onDelete(user._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
