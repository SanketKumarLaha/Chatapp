import { useContext } from "react";
import { authContext } from "../contexts/AuthContextProvider";

export const useAuthContext = () => {
  const context = useContext(authContext);
  return context;
};
