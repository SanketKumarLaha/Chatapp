import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUsersContext } from "../hooks/useUsersContext";
import { Contact2 } from "lucide-react";
import { useClickedUserContext } from "../hooks/useClickedUserContext";

const UsersPanel = () => {
  const { users } = useUsersContext();
  const { user } = useAuthContext();
  const { clickedUser } = useClickedUserContext();
  const clickedUserLength = Object.keys(clickedUser).length;

  const [searchUser, setSearchUser] = useState("");
  const [showUsers, setShowUsers] = useState([]);

  const [allUsers, setAllUsers] = useState([]);
  const [filteredOtherUsers, setFilteredOtherUsers] = useState([]);

  //? searching when typed and finding all users
  useEffect(() => {
    if (searchUser !== "") {
      setShowUsers(
        allUsers.filter((item) => item.username.includes(searchUser))
      );
    } else {
      setShowUsers(filteredOtherUsers);
    }
  }, [searchUser, allUsers, filteredOtherUsers]);

  useEffect(() => {
    if (Object.keys(clickedUser).length) setSearchUser("");
  }, [clickedUser]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      //? fetching all users
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/user/allusers"
      );
      const json = await response.json();

      //? getting all the users in the db except the current user
      const filteredAllUsers = json.filter(
        (item) => item._id !== user.newUser._id
      );
      setAllUsers(filteredAllUsers);

      //? getting all info about the users contacts who are messaging each other
      const otherUsers = [];
      users.forEach((user) => {
        const otherUser = json.find((item) => item._id === user);
        if (otherUser) {
          otherUsers.push(otherUser);
        }
      });
      setFilteredOtherUsers(otherUsers);
      setShowUsers(otherUsers);
    };
    fetchAllUsers();
  }, [users, user]);

  const handleAllUsers = async () => {
    //? setting all the users other than the current user when clicked to all contacts
    setShowUsers(allUsers);
  };

  return (
    <div
      className={`${
        clickedUserLength ? "w-0" : "w-full"
      } lg:w-1/4 h-full relative overflow-hidden box-border bg-green-500 border-r-2 border-secondary-color`}
    >
      <div
        className="bg-gradient-to-r from-purple-300 to-red-400 p-3 absolute bottom-5 right-5 rounded-lg cursor-pointer"
        onClick={handleAllUsers}
      >
        <Contact2 size={30} />
      </div>
      <div className="h-14  bg-primary-color p-2">
        <input
          type="text"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          placeholder="Search..."
          className="w-full h-full p-5 rounded-lg outline-none border border-secondary-color bg-primary-color text-third-color"
        />
      </div>
      <div className="w-full h-full overflow-auto bg-primary-color">
        {showUsers &&
          showUsers.map((item) => {
            return <UserCard key={item._id} item={item} />;
          })}
      </div>
    </div>
  );
};

export default UsersPanel;
