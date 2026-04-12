import React from "react";

const UserModal = ({ selectedUser, closeModal }) => {
  if (!selectedUser) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>User Details</h2>

        <div className="modal-details">
          <p>
            <strong>Name:</strong> {selectedUser.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Age:</strong> {selectedUser.age || "N/A"}
          </p>
          <p>
            <strong>Username:</strong> {selectedUser.username || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {selectedUser.phone || "N/A"}
          </p>
        </div>

        <button className="close-btn" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UserModal;
