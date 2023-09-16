import React, { useRef } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { MoreVertical, PawPrint, X } from "lucide-react";

const Navbar = () => {
  const { user, dispatch } = useAuthContext();

  const modalRef = useRef(null);

  const handleClick = () => {
    modalRef.current.showModal();
  };

  const handleCancel = () => {
    modalRef.current.close();
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
  };

  return (
    <div className="w-full h-16 flex justify-between items-center p-1 px-3 bg-primary-color border-b border-secondary-color box-border">
      <div className="flex items-center w-48">
        <h1 className="font-sans text-3xl font-semibold text-third-color">
          KittyTalk
        </h1>
        <div className="text-third-color ml-2">
          <PawPrint />
        </div>
      </div>

      <div className="relative flex justify-between items-center p-1 rounded-lg bg-primary-color text-third-color">
        <div className="flex justify-between items-center">
          <div
            className="bg-[image:var(--display-pic)] bg-cover w-10 h-10 mr-2 rounded-full"
            style={{
              "--display-pic": `url('${
                user?.newUser?.imageUrl !== ""
                  ? user?.newUser?.imageUrl
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
              }'
              )`,
            }}
          />
          <div className="hidden lg:block lg:w-fit">
            <h1 className="font-medium text-base">{user?.newUser?.username}</h1>
            <h1 className="text-sm text-slate-400">{user?.newUser?.email}</h1>
          </div>
        </div>
        <div onClick={handleClick} className="lg:ml-10 cursor-pointer">
          <MoreVertical />
        </div>
        <dialog
          ref={modalRef}
          className="p-5 absolute top-0 right-0 backdrop:bg-black backdrop:opacity-60 rounded"
        >
          <form action="" onSubmit={handleLogout} className="">
            <h1
              onClick={handleCancel}
              className="cursor-pointer absolute top-1 right-1 bg-green-400 rounded"
            >
              <X />
            </h1>
            <h1 className="font-semibold text-lg">{user?.newUser?.username}</h1>
            <h1 className="font-light text-base">{user?.newUser?.email}</h1>
            <div className="flex justify-center pt-2">
              <button className="bg-red-500 p-2 rounded">Logout</button>
            </div>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default Navbar;
