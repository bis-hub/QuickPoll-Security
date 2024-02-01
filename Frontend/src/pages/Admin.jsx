import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const checkAdmin = async () => {
      await axios
        .get(`${import.meta.env.VITE_API}/getallusers`, {
          headers: {
            Authorization: localStorage.getItem("cookie"),
          },
        })
        .then((data) => {
          setUsers(data.data);
        })
        .catch((err) => {
          navigate("/dashboard", { replace: true });
          toast.error("You are not allowed to access this page");
          console.log(err);
        });
    };
    checkAdmin();
  }, []);

  // Function to handle user deletion
  const handleDeleteUser = (userId) => {
    // Filter out the user with the given userId
    const updatedUsers = users.filter((user) => user.id !== userId);
    // Update the state with the new user list
    setUsers(updatedUsers);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Admin User management Dashboard</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users &&
          users.map((user) => (
            <li key={user.id} style={{ border: "1px solid #ddd", marginBottom: "10px", padding: "10px" }}>
              <div>
                <strong>Username:</strong> {user.username}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Role:</strong> {user.role}
              </div>
              <button
                onClick={() => handleDeleteUser(user.id)}
                style={{
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "10px",
                }}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Admin;
