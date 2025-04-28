import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { updateProfileRoute, uploadMedia } from "../utils/APIroute";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer, toast } from "react-toastify";

function EditProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const getUser = async () => {
    const user = await JSON.parse(localStorage.getItem("chat-app-user"));
    if (!user) {
      navigate("/login");
    } else {
      setUserData({ username: user.username, email: user.email });
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));

      const formData = new FormData();
      if (userData.image) {
        formData.append("image", userData.image);
      }
      const imageResponse = await axios.post(uploadMedia, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUserData = {
        ...userData,
        avatarImage: imageResponse.data.secure_url,
      };

      const { data } = await axios.patch(
        `${updateProfileRoute}/${user._id}`,
        updatedUserData
      );
      if (data.status === true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        toast.success("Profile updated successfully!");
        navigate("/");
      } else {
        toast.error(data.msg || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Container>
      <div className="form-container">
        <h2>Edit Profile</h2>
        {isLoading ? (
          <Skeleton count={5} />
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              name="password"
              value={userData.password}
              onChange={handleChange}
            />
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleImageChange}
            />
            <button type="submit">Save Changes</button>
          </form>
        )}
      </div>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(
    to bottom,
    #128c7e 0%,
    #128c7e 20%,
    #dcdcdc 20%,
    #dcdcdc 100%
  );
  display: flex;
  justify-content: center;
  align-items: center;

  .form-container {
    background-color: #ece5dd;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    h2 {
      text-align: center;
      color: #075e54;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      input {
        padding: 0.8rem;
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        outline: none;
      }

      button {
        padding: 0.8rem;
        background-color: #128c7e;
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: bold;
        cursor: pointer;

        &:hover {
          background-color: #075e54;
        }
      }
    }
  }
`;

export default EditProfile;
