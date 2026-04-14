import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../components/userprofile.css";
import { useAuth } from "../AuthContext";

const maskSensitiveData = (value, type) => {
  if (!value) return "";
  const str = String(value);
  if (str.length <= 4) return str;
  const masked = "X".repeat(str.length - 4) + str.slice(-4);
  return masked;
};

const UserProfile = () => {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (!authUser) return;

    api.get(`/users/id/${authUser.id}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, [authUser]);

  if (!user) return null;

  /* ---------------- EDIT PROFILE ---------------- */

  const handleProfileChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      await api.put(`/users/update/${user.email}`, {
        phoneNumber: user.phoneNumber,
      });
      alert("✅ Profile updated");
      setEditing(false);
    } catch {
      alert("❌ Update failed");
    }
  };

  /* ---------------- CHANGE PASSWORD ---------------- */

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const updatePassword = async () => {
    try {
      await api.put("/users/change-password", passwordData);
      alert("✅ Password updated");
      setChangingPassword(false);
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch {
      alert("❌ Password update failed");
    }
  };

  return (
    <div className="my-profile">
      <div className="profile-wrapper">
        <h2 className="profile-heading">👤 My Profile</h2>

        {/* ================= PROFILE CARD ================= */}
        <div className="profile-card">
          <div className="profile-placeholder">👤</div>
          <h3>{user.name}</h3>
          <p className="profile-email">{user.email}</p>

          <div className="profile-details">
            <p><b>🏦 Bank:</b> {user.bank?.name}</p>
            <p><b>🏢 Branch:</b> {user.branch?.name}</p>
            <p><b>💳 Account:</b> {maskSensitiveData(user.accountNumber, 'account')}</p>
            <p><b>📞 Phone:</b> {maskSensitiveData(user.phoneNumber, 'phone')}</p>
          </div>

          <div className="form-actions">
            <button className="edit-btn" onClick={() => {
              setEditing(!editing);
              setChangingPassword(false);
            }}>
               Edit Profile
            </button>

            <button className="edit-btn" style={{ background: "#8e44ad" }} onClick={() => {
              setChangingPassword(!changingPassword);
              setEditing(false);
            }}>
               Change Password
            </button>
          </div>
        </div>

        {/* ================= EDIT PROFILE ================= */}
        {editing && (
          <div className="edit-card">
            <h3>Edit Profile</h3>

            <input
              className="input-field"
              value={user.phoneNumber}
              name="phoneNumber"
              onChange={handleProfileChange}
              placeholder="Phone Number"
            />

            <div className="form-actions">
              <button className="save-btn" onClick={saveProfile}> Save</button>
              <button className="cancel-btn" onClick={() => setEditing(false)}>❌ Cancel</button>
            </div>
          </div>
        )}

        {/* ================= CHANGE PASSWORD ================= */}
        {changingPassword && (
          <div className="edit-card">
            <h3>Change Password</h3>

            <input
              className="input-field"
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
            />

            <input
              className="input-field"
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />

            <div className="form-actions">
              <button className="save-btn" onClick={updatePassword}> Update</button>
              <button className="cancel-btn" onClick={() => setChangingPassword(false)}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserProfile;
