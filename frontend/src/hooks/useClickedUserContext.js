import { useContext } from "react";
import { clickedUserContext } from "../contexts/ClickedUserContextProvider";

export const useClickedUserContext = () => {
  const context = useContext(clickedUserContext);
  return context;
};
