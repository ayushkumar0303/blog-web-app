import React from "react";
import { useSelector } from "react-redux";

export const ThemePage = ({ children }) => {
  const { isDark } = useSelector((state) => state.theme);

  return (
    <div className={`${isDark ? "dark" : "light"}`}>
      <div className="dark:text-white dark:bg-gray-900  text-black bg-white min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default ThemePage;
