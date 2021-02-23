import React, { useContext, useState, useEffect } from "react";
import firebase from "firebase";
import { auth } from "../firebase";

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

  function signup(email: string, password: string) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email: string) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email: string) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password: string) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user): void => {
      if (user) {
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
