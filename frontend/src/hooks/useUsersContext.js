import { useContext } from "react";
import { usersContext } from "../contexts/UsersContextProvider";

export const useUsersContext = () => {
  const context = useContext(usersContext);
  return context;
};
