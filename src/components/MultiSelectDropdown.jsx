import React, { useState, useEffect, useRef } from 'react';

const MultiSelectDropdown = ({ label, participants, selectedOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle the dropdown visibility
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Handle option selection/deselection
  const handleOptionChange = (id) => {
    const updatedSelectedOptions = selectedOptions.includes(id)
      ? selectedOptions.filter((optionId) => optionId !== id) // Remove if already selected
      : [...selectedOptions, id]; // Add if not selected
    onChange(updatedSelectedOptions); // Pass updated array of selected IDs
  };

  // Close the dropdown when clicking outside
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
            ? selectedOptions
                .map((id) => participants[id].name) // Map selected IDs to participant names
                .join(', ')
            : 'Choose Participants'}
        </span>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full border border-gray-300 bg-white rounded shadow-lg">
          {Object.entries(participants).map(([id, participant]) => (
            <label
              key={id}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                value={id}
                checked={selectedOptions.includes(Number(id))}
                onChange={() => handleOptionChange(Number(id))}
                className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded mr-2 focus:ring-blue-400"
              />
              <span className="text-gray-700">{participant.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
