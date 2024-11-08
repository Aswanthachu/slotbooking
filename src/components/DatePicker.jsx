import React from 'react';

export default function DatePicker({ dateRange, setDateRange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-2">
      <label>Start Date:</label>
      <input
        type="date"
        name="start"
        value={dateRange.start}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
      <label>End Date:</label>
      <input
        type="date"
        name="end"
        value={dateRange.end}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}
