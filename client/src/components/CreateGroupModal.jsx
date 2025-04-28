import React, { useState } from "react";
import axios from "axios";
import { createGroupRoute } from "../utils/APIroute";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";

export default function CreateGroupModal({
  setShowCreateGroup,
  contacts,
  currentUser,
}) {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleCheckboxChange = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!groupName || selectedUsers.length === 0) {
      toast.error("Please provide group name and select members", toastOptions);
      return;
    }

    try {
      await axios.post(createGroupRoute, {
        groupName,
        members: [currentUser._id, ...selectedUsers],
      });
      setShowCreateGroup(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Error creating group", toastOptions);
    }
  };

  return (
    <ModalOverlay>
      <FormContainer>
        <h2>Create Group</h2>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <UsersList>
          {contacts
            .filter(
              (contact) => contact.username && contact.username.trim() !== ""
            )
            .map((contact) => (
              <UserItem key={contact._id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(contact._id)}
                    onChange={() => handleCheckboxChange(contact._id)}
                  />
                  {contact.username}
                </label>
              </UserItem>
            ))}
        </UsersList>

        <ButtonGroup>
          <button className="create" onClick={handleCreate}>
            Create
          </button>
          <button className="cancel" onClick={() => setShowCreateGroup(false)}>
            Cancel
          </button>
        </ButtonGroup>
      </FormContainer>
    </ModalOverlay>
  );
}

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  h2 {
    margin-bottom: 1rem;
    color: #128c7e;
  }

  input[type="text"] {
    width: 100%;
    padding: 0.7rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
`;

const UsersList = styled.div`
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #f7f7f7;
  border-radius: 5px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UserItem = styled.div`
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
  }

  input[type="checkbox"] {
    transform: scale(1.2);
    accent-color: #128c7e;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  button {
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
  }

  .create {
    background-color: #4caf50;
    color: white;
  }

  .cancel {
    background-color: #f44336;
    color: white;
  }

  .create:hover {
    background-color: #45a049;
  }

  .cancel:hover {
    background-color: #e53935;
  }
`;
