import React from "react";
import { useClickedUserContext } from "../hooks/useClickedUserContext";

const UserCard = ({ item }) => {
  const { setClickedUser } = useClickedUserContext();

  const handleClick = () => {
    setClickedUser(item);
  };

  return (
    <div
      onClick={handleClick}
      className="h-20 px-3 bg-primary-color border-b border-slate-700 hover:bg-slate-800 cursor-pointer text-third-color"
    >
      <div className="flex items-center px-5 h-full rounded-fullr ">
        <div className="w-10/12 flex">
          <div
            className="bg-[image:var(--display-pic)] bg-cover w-12 h-12 rounded-full  "
            style={{
              "--display-pic": `url('${
                item.imageUrl
                  ? item.imageUrl
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
              }')`,
            }}
          />
          <div className="flex justify-between items-center ml-4">
            <h1 className="text-lg font-semibold">{item.username}</h1>
            {/* <h1>Last Message</h1> */}
          </div>
        </div>
        <div className="w-2/12">
          <div>{/* <h1 className="text-xs text-slate-400">6:50 Pm</h1> */}</div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
