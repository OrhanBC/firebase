import React from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { auth } from "./firebase";
import { useState, useEffect } from "react";

function App() {
  const [userState, setUserState] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  auth.onAuthStateChanged((user) => {
    setUserState(user);
    setAuthInitialized(true);
  });

  if (!authInitialized) {
    return <></>;
  }

  return <>{userState ? <Dashboard user={userState} /> : <Auth />}</>;
}

export default App;
