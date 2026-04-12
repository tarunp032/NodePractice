import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import UserModal from "../components/UserModal";

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    phone: "",
    username: "",
  });

  const baseURL = "http://localhost:8080/api/users";

  const getAllUsers = async () => {
    try {
      const response = await axios.get(baseURL);
      setUsers(response.data);
    } catch (error) {
      console.log("Error in getAllUsers:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`>>>>>>>>>>>Welcome to User Management Dashboard`);

    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === ""
    ) {
      alert("Please fill all required fields");
      return;
    }

    console.log("Form Data:", formData);

    try {
      const response = await axios.post(baseURL, formData);
      console.log("Saved User:", response.data);

      alert("User created successfully");

      setFormData({
        name: "",
        email: "",
        age: "",
        password: "",
        phone: "",
        username: "",
      });

      setShowForm(false);
      getAllUsers();
    } catch (error) {
      console.log("Error in adding user:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong while creating user");
      }
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`${baseURL}/${id}`);
      setSelectedUser(response.data);
    } catch (error) {
      console.log("Error in get user by id:", error);
      alert("Unable to fetch user details");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/${id}`);
      alert(response.data.message);
      getAllUsers();
    } catch (error) {
      console.log("Error in delete user:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong while deleting user");
      }
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="container">
          <h2>Welcome to User Management Dashboard</h2>
          <p>
            Add users, view user details, and delete users with a clean and
            modern interface.
          </p>

          <button
            className="add-user-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close Form" : "Add User"}
          </button>
        </div>
      </section>

      {showForm && (
        <section className="form-section">
          <div className="container">
            <form className="user-form" onSubmit={handleSubmit}>
              <h3>Add New User</h3>

              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button className="submit-btn" type="submit">
                Submit User
              </button>
            </form>
          </div>
        </section>
      )}

      <section className="users-section">
        <div className="container">
          <h3 className="section-title">All Users</h3>

          <div className="users-grid">
            {users.length > 0 ? (
              users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="no-user-text">No users found</p>
            )}
          </div>
        </div>
      </section>

      <UserModal selectedUser={selectedUser} closeModal={closeModal} />
    </main>
  );
};

export default Home;
