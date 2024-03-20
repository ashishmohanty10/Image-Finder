"use client";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { IoMdMoon } from "react-icons/io";
import { IoIosSunny } from "react-icons/io";

const DarkMode = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const [toggleTheme, setToggleTheme] = useState(false);
  const handleTheme = () => {
    setToggleTheme(!toggleTheme);
  };

  return (
    <button
      onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
      className="text-black dark:text-white"
    >
      <div onClick={handleTheme} className="text-2xl">
        {toggleTheme ? <IoMdMoon /> : <IoIosSunny />}
      </div>
    </button>
  );
};

export default DarkMode;
