import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const loginUser = JSON.parse(localStorage.getItem("loginUser"));
  const [userData, setUserData] = useState(null);

  const [openForgotModal, setOpenForgotModal] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);

  const [forgotData, setForgotData] = useState({
    email: loginUser?.email || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [resetData, setResetData] = useState({
    email: loginUser?.email || "",
    oldPassword: "",
    newPassword: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/user/profile/${loginUser?._id}`);
      setUserData(res.data.user);
    } catch (error) {
      console.log(error);
      alert("Failed to load profile");
    }
  };

  useEffect(() => {
    if (loginUser?._id) {
      fetchProfile();
    }
  }, [loginUser?._id]);

  const handleForgotChange = (e) => {
    setForgotData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetChange = (e) => {
    setResetData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/user/forgot-password",
        forgotData
      );

      alert(res.data.message);

      setOpenForgotModal(false);
      setForgotData({
        email: loginUser?.email || "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Forgot password failed");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/user/reset-password",
        resetData
      );

      alert(res.data.message);

      setOpenResetModal(false);
      setResetData({
        email: loginUser?.email || "",
        oldPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Reset password failed");
    }
  };

  if (!userData) {
    return (
      <section className="profile-page">
        <div className="profile-loading-card">Loading profile...</div>
      </section>
    );
  }

  return (
    <>
      <section className="profile-page">
        <div className="page-hero premium-hero">
          <h1 className="page-hero__title">My Profile</h1>
          <p className="page-hero__subtitle">
            View your account details and manage your password securely.
          </p>
        </div>

        <div className="profile-card">
          <div className="profile-card__top">
            <div className="profile-avatar">
              {userData.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className="profile-name">{userData.name}</h2>
              <p className="profile-email">{userData.email}</p>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-info-box">
              <span className="profile-info-label">Name</span>
              <span className="profile-info-value">{userData.name}</span>
            </div>

            <div className="profile-info-box">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{userData.email}</span>
            </div>

            <div className="profile-info-box">
              <span className="profile-info-label">Phone</span>
              <span className="profile-info-value">{userData.phone}</span>
            </div>

            <div className="profile-info-box">
              <span className="profile-info-label">Age</span>
              <span className="profile-info-value">{userData.age || "N/A"}</span>
            </div>

            <div className="profile-info-box">
              <span className="profile-info-label">Gender</span>
              <span className="profile-info-value">{userData.gender}</span>
            </div>

            <div className="profile-info-box">
              <span className="profile-info-label">City</span>
              <span className="profile-info-value">{userData.city}</span>
            </div>

            <div className="profile-info-box profile-info-box--full">
              <span className="profile-info-label">Address</span>
              <span className="profile-info-value">{userData.address}</span>
            </div>

            <div className="profile-info-box">
              <span className="profile-info-label">Status</span>
              <span className="profile-info-value">{userData.status}</span>
            </div>
          </div>

          <div className="profile-action-row">
            <button
              className="btn btn--secondary"
              onClick={() => setOpenForgotModal(true)}
            >
              Forget Password
            </button>

            <button
              className="btn btn--primary"
              onClick={() => setOpenResetModal(true)}
            >
              Reset Password
            </button>
          </div>
        </div>
      </section>

      {openForgotModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-card__top">
              <h2 className="modal-card__title">Forget Password</h2>
              <p className="modal-card__subtitle">
                Enter your email and set a new password directly.
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  value={forgotData.email}
                  onChange={handleForgotChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="newPassword"
                  value={forgotData.newPassword}
                  onChange={handleForgotChange}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="confirmPassword"
                  value={forgotData.confirmPassword}
                  onChange={handleForgotChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="form-actions">
                <button className="btn btn--primary" type="submit">
                  Update Password
                </button>
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={() => setOpenForgotModal(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openResetModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-card__top">
              <h2 className="modal-card__title">Reset Password</h2>
              <p className="modal-card__subtitle">
                Enter email, old password and new password.
              </p>
            </div>

            <form onSubmit={handleResetSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  value={resetData.email}
                  onChange={handleResetChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Old Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="oldPassword"
                  value={resetData.oldPassword}
                  onChange={handleResetChange}
                  placeholder="Enter old password"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="newPassword"
                  value={resetData.newPassword}
                  onChange={handleResetChange}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-actions">
                <button className="btn btn--primary" type="submit">
                  Reset Password
                </button>
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={() => setOpenResetModal(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;