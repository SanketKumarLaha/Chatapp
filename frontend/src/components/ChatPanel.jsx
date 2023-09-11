import { ArrowLeft, SendHorizonal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useClickedUserContext } from "../hooks/useClickedUserContext";
import { useUsersContext } from "../hooks/useUsersContext";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_URL);

const ChatPanel = () => {
  const { user } = useAuthContext();
  const { clickedUser, setClickedUser } = useClickedUserContext();
  const { users, setUsers } = useUsersContext();

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [showChatMessages, setShowChatMessages] = useState([]);

  const [allMessages, setAllMessages] = useState([]);

  const [tempUsers, setTempUsers] = useState([]);

  const clickedUserId = clickedUser._id;
  const userId = user.newUser._id;

  const clickedUserLength = Object.keys(clickedUser).length;

  const showLastMessage = useRef(null);

  useEffect(() => {
    showLastMessage.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [showChatMessages]);

  //? when clicked back setting the clickedUser context state to empty
  const goBack = () => {
    setClickedUser({});
  };

  // 👍
  //? getting all the messages of the user
  useEffect(() => {
    const callMessagesApi = async () => {
      //? getting all the messages of the current user
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/user/getUserMessages",
        {
          method: "POST",
          body: JSON.stringify({ id: userId }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      setAllMessages(json);
    };
    if (user) callMessagesApi();
  }, [user, userId, clickedUserId]);

  //? CHAT MESSAGES
  //? getting all the messages of the clickeduser that is clicked in the user's userspanel
  useEffect(() => {
    const existingClickedUserMessages = allMessages.filter(
      (item) =>
        item.clickedUserId === clickedUserId || item.userId === clickedUserId
    );
    setChatMessages(existingClickedUserMessages);
  }, [clickedUserId, allMessages]);

  //? filtering the Chat messages that recently came through socket
  useEffect(() => {
    const newFilteredChatMessages = chatMessages.filter(
      (item) =>
        item.userId === clickedUserId || item.clickedUserId === clickedUserId
    );
    setShowChatMessages(newFilteredChatMessages);
  }, [clickedUserId, chatMessages]);

  //? USERS
  //? getting the ids of all the otherUsers that sent or received messages
  useEffect(() => {
    let currentUserContacts = [];
    for (let messageObj of allMessages) {
      if (messageObj.clickedUserId !== userId) {
        currentUserContacts.push(messageObj.clickedUserId);
      }
      if (messageObj.userId !== userId) {
        currentUserContacts.push(messageObj.userId);
      }
    }
    //? filtered the otherUsers so that they only appear once in the array
    currentUserContacts = [...new Set(currentUserContacts)];
    setUsers(currentUserContacts);
    setTempUsers(currentUserContacts);
  }, [userId, allMessages, setUsers]);

  useEffect(() => {
    const currentUserContacts = [...new Set(tempUsers)];
    setUsers(currentUserContacts);
  }, [tempUsers, setUsers]);

  //? SOCKET OPERATIONS
  //? setting userIds to all the users that signed up
  useEffect(() => {
    if (user) {
      socket.emit("setUserId", userId);
    }
  }, [user, userId]);

  //? receiving meesages from other users and setting the messages to a state chatMessages
  useEffect(() => {
    socket.on("receivedMessage", ({ message, clickedUserId, userId }) => {
      setChatMessages((prev) => [...prev, { message, clickedUserId, userId }]);
      setTempUsers((prev) => [...prev, userId]);
    });
  }, []);

  //? when sent messages sending a event sendingMessage to the receiver
  const handleClick = (e) => {
    e.preventDefault();
    socket.emit("sendingMessage", {
      message,
      clickedUserId,
      userId,
    });

    //? showing the message  to the sender's ui
    setChatMessages((prev) => [
      ...prev,
      {
        message,
        clickedUserId,
        userId,
      },
    ]);

    //? when message is sent the users context state gets updated with the one to whom the message is sent
    const clickedUserExists = users.some((item) => item === clickedUserId);
    if (!clickedUserExists) {
      setUsers((prev) => [...prev, clickedUserId]);
    }
    setMessage("");
  };

  return !clickedUserLength ? (
    <div
      className={`lg:w-3/4 ${
        clickedUserLength ? "w-full" : "w-0"
      } h-full bg-primary-color
      `}
    ></div>
  ) : (
    <div
      className={`lg:w-3/4 ${
        clickedUserLength ? "w-full" : "w-0"
      } h-full bg-primary-color text-third-color`}
    >
      <div className="flex justify-between items-center p-3 h-14 bg-primary-color border-b border-secondary-color box-border">
        <div className="flex items-center">
          <div onClick={goBack} className="cursor-pointer">
            <ArrowLeft />
          </div>
          <div
            className="bg-[image:var(--display-pic)] bg-cover w-10 h-10 border-2 border-third-color rounded-full bg-red-400"
            style={{
              "--display-pic": `url('${
                clickedUser?.imageUrl
                  ? clickedUser.imageUrl
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
              }')`,
            }}
          ></div>
          <div className="pl-3 ">
            <h1 className="font-semibold text-lg">{clickedUser?.username}</h1>
          </div>
        </div>
        <div>{/* <MoreVertical /> */}</div>
      </div>

      <div className="w-full h-[calc(100%-8.5rem)] relative flex flex-col overflow-y-auto ">
        {showChatMessages &&
          showChatMessages.map((item, index) => {
            return (
              <div
                key={index}
                className={`flex p-2 ${
                  item.userId === user?.newUser?._id && "justify-end"
                }`}
              >
                <div
                  className={`m-1 inline-block max-w-[50%] rounded ${
                    item.userId === user?.newUser?._id
                      ? "bg-sky-300"
                      : "bg-secondary-color"
                  }`}
                >
                  <h1
                    className={`text-lg px-3 ${
                      item.userId === user?.newUser?._id
                        ? "text-black"
                        : "text-third-color"
                    }`}
                  >
                    {item.message}
                  </h1>
                </div>
              </div>
            );
          })}
        <div ref={showLastMessage}></div>
      </div>

      <div className="">
        <form
          action=""
          onSubmit={handleClick}
          className=" h-20 bg-primary-color flex justify-around items-center"
        >
          <div className="w-10/12 h-2/3 px-10 flex items-center rounded-full bg-slate-800">
            <input
              type="text"
              value={message}
              placeholder="Type a message..."
              onChange={(e) => setMessage(e.target.value)}
              className="w-full outline-none bg-slate-800"
            />
          </div>
          <div className="w-1/12 flex justify-center items-start">
            <button className="flex justify-around items-center rounded-full cursor-pointer  w-full p-2 bg-gradient-to-r from-blue-300 to-yellow-300">
              <h1 className="text-sm font-semibold text-black">Send</h1>
              <SendHorizonal size={26} strokeWidth={2} className="text-black" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
