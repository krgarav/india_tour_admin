import React from 'react';

const Chip = ({ label, onDelete }) => {
  return (
    <div className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full border  border-rose-100">
      {label}
      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Chip;
