import React from 'react';

const TextBox: React.FC<TextBoxProps> = ({ strings }) => {
  return (
    <div className="flex flex-wrap items-center p-4">
      {strings.map((str, index) => (
        <div
          key={index}
          className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full border  border-rose-100"
        >
          {str}
        </div>
      ))}
    </div>
  );
};

interface TextBoxProps {
  strings: string[];
}

export default TextBox;
