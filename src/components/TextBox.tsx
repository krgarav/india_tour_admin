// src/TextBox.js
import React from 'react';

const TextBox = ({ strings }) => {
  return (
    <div className="flex flex-wrap items-center p-4">
      {strings.map((str, index) => (
        <div
          key={index}
          className="inline-block w-32 h-12 m-1 p-2 text-black dark:text-white text-center leading-[14px] border border-gray-300 shadow-sm rounded-md "
        >
          {str}
        </div>
      ))}
    </div>
  );
};

export default TextBox;
