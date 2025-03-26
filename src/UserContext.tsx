import { createContext, ReactNode, useContext, useState } from "react";

interface User {
    uid: string | null;
    name: string | null;
    photo: string | null;
}


interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({ uid: null, name: null, photo: null });
  
    return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    );
  };
  