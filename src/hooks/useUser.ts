"use client";

import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

interface UserData {
  guestId: string;
  playerName: string;
}

export const useUser = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Try to get existing user data from localStorage
    const savedData = localStorage.getItem("chess-user-data");

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUserData(parsed);
      } catch (error) {
        console.error("Failed to parse saved user data:", error);
        createNewUser();
      }
    } else {
      createNewUser();
    }
  }, []);

  const createNewUser = () => {
    const newUserData: UserData = {
      guestId: nanoid(10),
      playerName: `Player${Math.floor(Math.random() * 1000)}`,
    };

    setUserData(newUserData);
    localStorage.setItem("chess-user-data", JSON.stringify(newUserData));
  };

  const updatePlayerName = (name: string) => {
    if (!userData) return;

    const updatedData = { ...userData, playerName: name };
    setUserData(updatedData);
    localStorage.setItem("chess-user-data", JSON.stringify(updatedData));
  };

  return {
    userData,
    updatePlayerName,
    createNewUser,
  };
};
