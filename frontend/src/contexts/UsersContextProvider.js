import { createContext, useState } from "react";

export const usersContext = createContext(null);

export const UsersContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  // console.log("UsersContextProvider", users);
  return (
    <usersContext.Provider value={{ users, setUsers }}>
      {children}
    </usersContext.Provider>
  );
};
