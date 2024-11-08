"use client";

import { GoStopwatch } from "react-icons/go";

import React, { useState } from "react";
import InputField from "@/components/InputField";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import Button from "@/components/Button";
import { participants } from "@/utils/slotUtils";
import axios from "axios";

const AvailabilityPage = () => {
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [availableSlots, setAvailableSlots] = useState(null);


  const handleCheckSlots = async() => {
    
    try {
      const response = await axios.post('/api/availability', {
        participant_ids: selectedParticipants,
        date_range: dateRange,
      });
  
      if (response.data.success) {
        setAvailableSlots(response.data.availableSlots);
      } else {
        console.error('Error:', response.data.error);
      }
    } catch (err) {
      console.error('API Error:', err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="p-6   bg-white ">
      <div className="max-w-md space-y-14 mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">
          Check Availability
        </h1>

        <MultiSelectDropdown
          label="Select Participants"
          participants={participants}
          selectedOptions={selectedParticipants}
          onChange={setSelectedParticipants}
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
        <div className="mt-6 bg-[#f5f0e6] p-4 rounded-3xl md:max-w-2xl lg:max-w-3xl mx-auto sm:px-6 md:px-10 lg:px-20 !my-20">
          <h2 className="text-lg font-semibold text-center underline md:text-xl lg:text-2xl">
            Available Slots
          </h2>
          {Object.entries(availableSlots).map(([date, timeSlots]) => (
            <div
              key={date}
              className="my-10 w-full flex flex-col md:flex-row items-start justify-start gap-5"
            >
              <div className="text-sm font-semibold mb-2 md:mb-0 flex">{date} :</div>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot, index) => (
                  <span
                    key={index}
                    className="bg-[#5f5fe1] text-white py-1 px-2 rounded-full text-xs flex items-center space-x-2"
                  >
                    <GoStopwatch style={{ width: "15px", height: "15px" }} />
                    <p className="truncate">{slot}</p>
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
