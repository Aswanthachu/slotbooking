import React, { useState, useEffect, useRef } from 'react';

const MultiSelectDropdown = ({ label, options, selectedOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionChange = (value) => {
    onChange({
      target: {
        value,
      },
    });
  };

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <div
        className="border border-gray-300 rounded p-2 bg-[#ebebeb] cursor-pointer"
        onClick={toggleDropdown}
      >
        <span className="text-gray-700">
          {selectedOptions.length > 0
            ? selectedOptions.join(', ')
            : 'Choose Participants'}
        </span>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full border border-gray-300 bg-white rounded shadow-lg">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionChange(option)}
                className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded mr-2 focus:ring-blue-400"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
