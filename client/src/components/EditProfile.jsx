import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { updateProfileRoute } from "../utils/APIroute";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem("chat-app-user"))._id;
      const { data } = await axios.patch(`${updateProfileRoute}/${userId}`, {
        username,
        email,
        password,
      });

      if (data.status) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        setMessage("Profile updated successfully!");
      }
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <FormContainer>
      <h2>Edit Profile</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="New Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="New Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Update Profile</button>
        {message && <p>{message}</p>}
      </form>
    </FormContainer>
  );
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 300px;

    input {
      padding: 0.7rem;
      border-radius: 5px;
      border: 1px solid #ccc;
    }

    button {
      padding: 0.7rem;
      border: none;
      border-radius: 5px;
      background-color: #4caf50;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    button:hover {
      background-color: #45a049;
    }

    p {
      margin-top: 1rem;
      color: green;
      font-weight: bold;
    }
  }
`;
