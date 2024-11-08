"use client";

import { GoStopwatch } from "react-icons/go";

import React, { useState } from "react";
import InputField from "@/components/InputField";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import Button from "@/components/Button";

const AvailabilityPage = () => {
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [availableSlots, setAvailableSlots] = useState(null);

  const handleParticipantChange = (e) => {
    const value = e.target.value;
    setSelectedParticipants((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleCheckSlots = () => {
    // Simulated API response for demonstration
    setAvailableSlots({
      "11-10-24": ["09:30 - 10:00", "02:30 - 03:00", "04:30 - 05:00"],
      "12-10-24": ["10:30 - 11:00", "01:30 - 02:00", "03:30 - 04:00"],
      "13-10-24": ["11:30 - 12:00", "02:30 - 03:00", "03:30 - 04:00"],
      "14-10-24": ["09:30 - 10:00", "02:30 - 03:00", "04:30 - 05:00"],
    });
  };

  return (
    <div className="p-6   bg-white ">
      <div className="max-w-md space-y-14 mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">
          Check Availability
        </h1>

        <MultiSelectDropdown
          label="Choose Participants"
          options={["John", "David", "Christo", "Sam"]}
          selectedOptions={selectedParticipants}
          onChange={handleParticipantChange}
        />

        <InputField
          label="Start Date"
          type="date"
          value={dateRange.start}
          onChange={(e) =>
            setDateRange({ ...dateRange, start: e.target.value })
          }
        />

        <InputField
          label="End Date"
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />

        <Button label="Check Slot" onClick={handleCheckSlots} />
      </div>

      {availableSlots ? (
        <div className="mt-6 bg-[#f5f0e6] p-4 rounded-3xl max-w-fit mx-auto px-20 !my-20">
          <h2 className="text-lg font-semibold text-center underline">
            Available Slots
          </h2>
          {Object.entries(availableSlots).map(([date, timeSlots]) => (
            <div key={date} className="my-10 flex items-center justify-center gap-5 ">
              <div className="text-sm">{date} :</div>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot, index) => (
                  <span
                    key={index}
                    className="bg-[#5f5fe1] text-white py-1 px-2 rounded-full text-xs flex justify-center items-center space-x-2"
                  >
                    <GoStopwatch style={{width:"15px",height:"15px"}}/>
                    <p>{slot}</p>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default AvailabilityPage;
