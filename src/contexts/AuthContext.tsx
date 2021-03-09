import React, { useContext, useState, useEffect } from "react";
import firebase from "firebase";
import { clearDB } from "@events/dbEvents";
import { auth } from "../firebase";

declare global {
  interface Window {
    userId: string;
  }
}

interface IAuthContextValue {
  currentUser: firebase.User;
  signup: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  login: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

interface IAuthProviderProps {
  children: JSX.Element;
}

const AuthContext = React.createContext<IAuthContextValue>(
  {} as IAuthContextValue
);

export function useAuth(): IAuthContextValue {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: IAuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<firebase.User>(
    {} as firebase.User
  );
  const [loading, setLoading] = useState<boolean>(true);

  const signup = (email: string, password: string) =>
    auth.createUserWithEmailAndPassword(email, password);

  const login = (email: string, password: string) =>
    auth.signInWithEmailAndPassword(email, password);

  const logout = () => auth.signOut();

  const resetPassword = (email: string) => auth.sendPasswordResetEmail(email);

  const updateEmail = (email: string) => currentUser.updateEmail(email);

  const updatePassword = (password: string) =>
    currentUser.updatePassword(password);

  useEffect(() => {
    clearDB();
    const unsubscribe = auth.onAuthStateChanged((user): void => {
      if (user) {
        window.userId = user.uid;
        setCurrentUser(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
