import React, { useEffect, useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import Logout from "./Logout";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdGroups2 } from "react-icons/md";
import CreateGroupModal from "./CreateGroupModal";

import styled from "styled-components";

export default function Contacts(props) {
  const { contacts, currentUser, changeChat } = props;
  const [currentUserName, setCurrentUserName] = useState();
  const [currentSelected, setCurrentSelected] = useState();
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  // console.log(contacts);
  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const handleCreateGroup = () => {
    setShowCreateGroup(true);
  };

  return (
    <>
      {currentUserName && (
        <Container>
          <div className="contact-header">
            <div className="current-user">
              <div className="avatar">
                {currentUser.avatarImage ? (
                  <img src={currentUser.avatarImage} alt="" />
                ) : (
                  <IoPersonCircle />
                )}
              </div>
              <div className="username">
                <h2>{currentUserName}</h2>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                position: "relative",
              }}
            >
              <MdGroups2
                onClick={handleCreateGroup}
                style={{ cursor: "pointer", fontSize: "2rem" }}
              />
              <Logout />
            </div>
          </div>

          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    {props.loading && (
                      <Skeleton
                        circle
                        height="100%"
                        containerClassName="avatar-skeleton"
                      />
                    )}
                    {contact.avatarImage ? (
                      <img src={contact.avatarImage} alt="" />
                    ) : (
                      <IoPersonCircle />
                    )}
                  </div>
                  <div className="username">
                    {props.loading ? (
                      <Skeleton width={70} />
                    ) : (
                      <h3>
                        {contact.isGroup ? contact.groupName : contact.username}
                      </h3>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="footer">
            <button onClick={() => (window.location.href = "/edit-profile")}>
              Edit Profile
            </button>
          </div>
          {showCreateGroup && (
            <CreateGroupModal
              setShowCreateGroup={setShowCreateGroup}
              contacts={contacts}
              currentUser={currentUser}
            />
          )}
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: white;
  .contact-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ededed;
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 3rem;
      cursor: pointer;
      width: 100%;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
          width: 3rem;
          border-radius: 3rem;
        }
        svg {
          color: #a0a0a0;
          font-size: 3rem;
          cursor: pointer;
        }
      }
      .username {
        h3 {
          color: black;
        }
      }
    }
    .selected {
      background-color: lightgrey;
    }
  }

  .current-user {
    background-color: transparent;
    display: flex;
    gap: 1rem;
    padding: 0.5rem;
    border-right-color: transparent;
    height: 0.5rem;
    align-items: center;
    .avatar {
      img {
        height: 2rem;
        max-inline-size: 100%;
      }
      svg {
        color: #a0a0a0;
        font-size: 3rem;
        cursor: pointer;
      }
    }
    .username {
      h2 {
        color: grey;
      }
    }
    button {
      border: none;
      background: none;
      position: relative;
      margin-left: 100px;
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
  .footer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem;

    button {
      padding: 0.4rem 0.8rem;
      background-color: #128c7e;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: bold;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background-color 0.3s ease-in-out;

      &:hover {
        background-color: #075e54;
      }
    }
  }
`;
