"use server";
import { NextResponse } from "next/server";

// Local Participant and availability data
const participants = {
  1: { name: "Adam", threshold: 4 },
  2: { name: "Bosco", threshold: 4 },
  3: { name: "Catherine", threshold: 5 },
};

const participantAvailability = {
  1: {
    Monday: [
      { start: "09:00", end: "11:00" },
      { start: "14:00", end: "16:30" },
    ],
    Tuesday: [{ start: "09:00", end: "18:00" }],
  },
  2: {
    Monday: [{ start: "09:00", end: "18:00" }],
    Tuesday: [{ start: "09:00", end: "11:30" }],
  },
  3: {
    Monday: [{ start: "09:00", end: "18:00" }],
    Tuesday: [{ start: "09:00", end: "18:00" }],
  },
};

const schedules = {
  1: {
    "28-10-2024": [
      { start: "09:30", end: "10:30" },
      { start: "15:00", end: "16:30" },
    ],
  },
  2: {
    "28-10-2024": [{ start: "13:00", end: "13:30" }],
    "29-10-2024": [{ start: "09:00", end: "10:30" }],
  },
};

// Utility function to reformat date from yyyy-mm-dd to dd-mm-yyyy
const reformatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};

// Utility function to convert time string (HH:MM) to minutes
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Utility function to convert minutes to HH:MM
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

// Utility function to generate 30-minute slots between two times
const generate30MinSlots = (start, end) => {
  const slots = [];
  let current = timeToMinutes(start);
  const endTime = timeToMinutes(end);
  while (current + 30 <= endTime) {
    const slotStart = minutesToTime(current);
    const slotEnd = minutesToTime(current + 30);
    slots.push(`${slotStart}-${slotEnd}`);
    current += 30;
  }
  return slots;
};

// Function to check participant available slots
const checkParticipantAvailableSlots = ({ participant_ids, date_range }) => {
  const result = {};
  const startDate = reformatDate(date_range.start); // Convert to dd-mm-yyyy format
  const endDate = reformatDate(date_range.end); // Convert to dd-mm-yyyy format
  const dateList = generateDateRange(startDate, endDate);
  console.log("Generated Date Range:", dateList); // Debugging the date range

  // Loop through the dates and check for available slots
  dateList.forEach((date) => {
    let commonSlots = null;

    participant_ids.forEach((id) => {
      const availability = participantAvailability[id] || {};
      const schedule = schedules[id]?.[date] || [];

      // Determine the day of the week for this date (e.g., Monday, Tuesday)
      const dayOfWeek = new Date(
        date.split("-").reverse().join("-")
      ).toLocaleString("en-US", { weekday: "long" });

      // Get the participant's availability for this day
      const dailySlots = availability[dayOfWeek] || [];
      let availableSlots = [];

      // Generate available time slots
      dailySlots.forEach((slot) => {
        availableSlots = availableSlots.concat(
          generate30MinSlots(slot.start, slot.end)
        );
      });

      // Exclude scheduled slots
      schedule.forEach((meeting) => {
        const meetingSlots = generate30MinSlots(meeting.start, meeting.end);
        availableSlots = availableSlots.filter(
          (slot) => !meetingSlots.includes(slot)
        );
      });

      // Respect the participant's threshold and limit the slots
      availableSlots = availableSlots.slice(0, participants[id].threshold);

      commonSlots = commonSlots
        ? commonSlots.filter((slot) => availableSlots.includes(slot))
        : availableSlots;
    });

    if (commonSlots && commonSlots.length > 0) {
      result[date] = commonSlots;
    }
  });

  return result;
};

const generateDateRange = (start, end) => {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  const dateArray = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    dateArray.push(`${day}-${month}-${year}`);

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

// Helper function to parse date in dd-mm-yyyy format
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid date: ${dateStr}`);
  }
  return date;
};

export async function POST(request) {
  try {
    const body = await request.json(); // Extract request body
    const { participant_ids, date_range } = body;

    console.log("Received Data:", { participant_ids, date_range });

    const result = checkParticipantAvailableSlots({
      participant_ids,
      date_range,
    });

    return NextResponse.json({ success: true, availableSlots: result });
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
