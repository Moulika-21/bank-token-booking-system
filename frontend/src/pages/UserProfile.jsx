// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../components/userprofile.css"; // Import the CSS

// const UserProfile = () => {
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     branch: { name: "" },
//     phoneNumber: "",
//     profileImage: "",
//   });

//   const [editing, setEditing] = useState(false);

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     if (userId) {
//       axios
//         .get(`http://localhost:8083/api/users/id/${userId}`)
//         .then((res) => setUser(res.data))
//         .catch((err) => console.error("Error fetching user:", err));
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith("branch")) {
//       setUser({ ...user, branch: { ...user.branch, name: value } });
//     } else {
//       setUser({ ...user, [name]: value });
//     }
//   };

//   const handleUpdate = () => {
//     axios
//       .put(`http://localhost:8083/api/users/update/${user.email}`, user)
//       .then(() => {
//         alert("Profile updated successfully!");
//         setEditing(false);
//       })
//       .catch((err) => console.error("Error updating profile:", err));
//   };

//   return (
//     <div className="profile-container">
//       <h2 className="profile-title">👤 My Profile</h2>

//       {!editing ? (
//         <div className="profile-card">
//           {user.profileImage && (
//             <img
//               src={user.profileImage}
//               alt="Profile"
//               className="profile-img"
//             />
//           )}
//           <p>
//             <b>Name:</b> {user.name}
//           </p>
//           <p>
//             <b>Email:</b> {user.email}
//           </p>
//           <p>
//             <b>Phone:</b> {user.phoneNumber}
//           </p>
//           <p>
//             <b>Branch:</b> {user.branch?.name}
//           </p>
//           <button className="edit-btn" onClick={() => setEditing(true)}>
//             Edit Profile
//           </button>
//         </div>
//       ) : (
//         <div className="edit-form">
//           <input
//             name="name"
//             value={user.name}
//             onChange={handleChange}
//             placeholder="Name"
//           />
//           <input
//             name="phoneNumber"
//             value={user.phoneNumber}
//             onChange={handleChange}
//             placeholder="Phone"
//           />
//           <input
//             name="branchName"
//             value={user.branch?.name}
//             onChange={(e) =>
//               setUser({ ...user, branch: { ...user.branch, name: e.target.value } })
//             }
//             placeholder="Branch"
//           />
//           <div className="form-actions">
//             <button className="save-btn" onClick={handleUpdate}>
//               Save
//             </button>
//             <button className="cancel-btn" onClick={() => setEditing(false)}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfile;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../components/userprofile.css"; // Custom CSS

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    branch: { name: "" },
    phoneNumber: "",
    profileImage: "",
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:8083/api/users/id/${userId}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("branch")) {
      setUser({ ...user, branch: { ...user.branch, name: value } });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8083/api/users/update/${user.email}`, user)
      .then(() => {
        alert("✅ Profile updated successfully!");
        setEditing(false);
      })
      .catch((err) => console.error("Error updating profile:", err));
  };

  return (
    <>
    <div className="my-profile">
    <div className="profile-wrapper">
      <h2 className="profile-heading">👤 My Profile</h2>

      {!editing ? (
        <div className="profile-card">
          <div className="profile-top">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="profile-img" />
            ) : (
              <div className="profile-placeholder">👤</div>
            )}
            <h3>{user.name}</h3>
            <p className="profile-email">{user.email}</p>
          </div>

          <div className="profile-details">
            <p><b>📞 Phone:</b> {user.phoneNumber}</p>
            <p><b>🏦 Branch:</b> {user.branch?.name}</p>
          </div>

          <button className="edit-btn" onClick={() => setEditing(true)}>
            ✏️ Edit Profile
          </button>
        </div>
      ) : (
        <div className="edit-card">
          <h3>Edit Profile</h3>
          <input
            className="input-field"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Full Name"
          />
          <input
            className="input-field"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <input
            className="input-field"
            name="branchName"
            value={user.branch?.name}
            onChange={(e) =>
              setUser({ ...user, branch: { ...user.branch, name: e.target.value } })
            }
            placeholder="Branch"
          />
          <div className="form-actions">
            <button className="save-btn" onClick={handleUpdate}>💾 Save</button>
            <button className="cancel-btn" onClick={() => setEditing(false)}>❌ Cancel</button>
          </div>
        </div>
      )}
    </div>
    
    </div>
    <footer className="footer">
      &copy; {new Date().getFullYear()} Bank Token Booking System. All rights reserved.
    </footer>
    </>
  );
};

export default UserProfile;
