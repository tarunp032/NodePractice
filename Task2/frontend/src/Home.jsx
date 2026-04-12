import React, { useEffect, useState } from "react";
import axios from "axios";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  age: "",
  gender: "",
  dob: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  address: "",
  occupation: "",
  company: "",
  salary: "",
  website: "",
  linkedIn: "",
  skills: "",
  bio: "",
};

const Home = () => {
  const [formData, setFormData] = useState(initialForm);
  const [users, setUsers] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editId, setEditId] = useState(null);

  const API = "http://localhost:8080/api/users";

  const getAllUsers = async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((oldData) => {
      return {
        ...oldData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, formData);
      } else {
        await axios.post(API, formData);
      }

      setFormData(initialForm);
      setEditId(null);
      setShowFormModal(false);
      getAllUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`${API}/${id}`);
      setSelectedUser(res.data);
      setShowViewModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: user.password || "",
      phone: user.phone || "",
      age: user.age || "",
      gender: user.gender || "",
      dob: user.dob || "",
      city: user.city || "",
      state: user.state || "",
      country: user.country || "",
      pincode: user.pincode || "",
      address: user.address || "",
      occupation: user.occupation || "",
      company: user.company || "",
      salary: user.salary || "",
      website: user.website || "",
      linkedIn: user.linkedIn || "",
      skills: user.skills || "",
      bio: user.bio || "",
    });

    setEditId(user._id);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.put(`${API}/delete/${id}`);
      getAllUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`${API}/restore/${id}`);
      getAllUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setShowFormModal(false);
    setShowViewModal(false);
    setEditId(null);
    setFormData(initialForm);
  };

  return (
    <div className="page">
      <header className="header">
        <div className="logo">User Management App</div>
        <button
          className="add-btn"
          onClick={() => {
            setEditId(null);
            setFormData(initialForm);
            setShowFormModal(true);
          }}
        >
          Add User
        </button>
      </header>

      <section className="hero">
        <h1>Welcome to User Dashboard</h1>
        
        <p>
          Add, update, view and manage users with modern UI and soft delete /
          restore feature.
        </p>
      </section>

      <section className="users-section">
        <h2>All Users</h2>

        <div className="card-container">
          {users.map((user) => (
            <div
              className={`user-card ${
                user.status === "inactive" ? "inactive-card" : ""
              }`}
              key={user._id}
            >
              <h3>
                {user.firstName} {user.lastName}
              </h3>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Status:</strong> {user.status}
              </p>

              <div className="card-buttons">
                <button
                  className="view-btn"
                  onClick={() => handleView(user._id)}
                >
                  View Details
                </button>

                <button className="update-btn" onClick={() => handleEdit(user)}>
                  Update
                </button>

                {user.status === "active" ? (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    className="restore-btn"
                    onClick={() => handleRestore(user._id)}
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 User Management System | React + Node + Express + MongoDB</p>
      </footer>

      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal form-modal">
            <div className="modal-header">
              <h2>{editId ? "Update User" : "Add User"}</h2>
              <button className="close-btn" onClick={closeModal}>
                X
              </button>
            </div>

            <form className="user-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
              <input
                type="text"
                name="occupation"
                placeholder="Occupation"
                value={formData.occupation}
                onChange={handleChange}
              />
              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
              />
              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={formData.salary}
                onChange={handleChange}
              />
              <input
                type="url"
                name="website"
                placeholder="Website URL"
                value={formData.website}
                onChange={handleChange}
              />
              <input
                type="url"
                name="linkedIn"
                placeholder="LinkedIn URL"
                value={formData.linkedIn}
                onChange={handleChange}
              />
              <input
                type="text"
                name="skills"
                placeholder="Skills"
                value={formData.skills}
                onChange={handleChange}
              />
              <textarea
                name="bio"
                placeholder="Bio"
                value={formData.bio}
                onChange={handleChange}
              />

              <button type="submit" className="submit-btn">
                {editId ? "Update User" : "Submit User"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal view-modal">
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="close-btn" onClick={closeModal}>
                X
              </button>
            </div>

            <div className="details-grid">
              <p>
                <strong>First Name:</strong> {selectedUser.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedUser.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Password:</strong> {selectedUser.password}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Age:</strong> {selectedUser.age}
              </p>
              <p>
                <strong>Gender:</strong> {selectedUser.gender}
              </p>
              <p>
                <strong>DOB:</strong> {selectedUser.dob}
              </p>
              <p>
                <strong>City:</strong> {selectedUser.city}
              </p>
              <p>
                <strong>State:</strong> {selectedUser.state}
              </p>
              <p>
                <strong>Country:</strong> {selectedUser.country}
              </p>
              <p>
                <strong>Pincode:</strong> {selectedUser.pincode}
              </p>
              <p>
                <strong>Address:</strong> {selectedUser.address}
              </p>
              <p>
                <strong>Occupation:</strong> {selectedUser.occupation}
              </p>
              <p>
                <strong>Company:</strong> {selectedUser.company}
              </p>
              <p>
                <strong>Salary:</strong> {selectedUser.salary}
              </p>
              <p>
                <strong>Website:</strong> {selectedUser.website}
              </p>
              <p>
                <strong>LinkedIn:</strong> {selectedUser.linkedIn}
              </p>
              <p>
                <strong>Skills:</strong> {selectedUser.skills}
              </p>
              <p>
                <strong>Bio:</strong> {selectedUser.bio}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
