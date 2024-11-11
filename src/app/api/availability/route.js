"use server";
import connectToRedis from "@/lib/redis";
import { NextResponse } from "next/server";

const redis = await connectToRedis();

// ****************** Helper functions ****************

// Helper function to reformat date
const reformatDate = (date) => {
  const [day, month, year] = date.split("-");
  return `${day}-${month}-${year}`;
};

// Helper function to get day from a date
const getDayOfWeek = (date) => {
  const [day, month, year] = date.split("-");
  const formattedDate = `${year}-${month}-${day}`;
  const dayOfWeek = new Date(formattedDate).toLocaleString("en-us", {
    weekday: "long",
  });

  return dayOfWeek;
};

// Helper function to format time.
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Helper function to convert milliseconds to HH:mm time format
function parseTimeToDate(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);  // Set the time part of the current date
  return now;
}


// **************** Calculations *************


const generateDateRange = (startDate, endDate) => {
  // Parse the input dates directly since they're in 'YYYY-MM-DD' format
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if the start and end dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error("Invalid Date object");
    return [];
  }

  const dateList = [];

  for (
    let current = start;
    current <= end;
    current.setDate(current.getDate() + 1)
  ) {
    const day = String(current.getDate()).padStart(2, "0"); // Day with leading zero
    const month = String(current.getMonth() + 1).padStart(2, "0"); // Month with leading zero
    const year = current.getFullYear();

    // Format the date as 'DD-MM-YYYY'
    const formattedDate = `${day}-${month}-${year}`;
    dateList.push(formattedDate);
  }

  return dateList;
};

const countThirtyMinuteIntervals = (schedule) => {
  let totalThirtyMinuteSlots = 0;

  schedule.forEach(({ start, end }) => {
    // Convert start and end times to Date objects for easy calculation
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);

    // Calculate the difference in milliseconds
    const diffInMilliseconds = endTime - startTime;

    // Convert milliseconds to minutes
    const diffInMinutes = diffInMilliseconds / (1000 * 60);

    // Calculate the number of 30-minute intervals in the duration
    const slots = Math.floor(diffInMinutes / 30);
    totalThirtyMinuteSlots += slots;
  });

  return totalThirtyMinuteSlots;
};

const findAvailableSlots = (dailyAvailableSlots, scheduledSlots) => {

  const convertToMinutes = (time) => {
    if (!time) {
      console.error("Invalid time input:", time);
      return 0; // or handle appropriately (e.g., throw an error or return a default value)
    }
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getAvailableSlots = (available, scheduled) => {
    const availableSlots = [];

    // Sort scheduled slots by start time
    scheduled.sort(
      (a, b) => convertToMinutes(a.start) - convertToMinutes(b.start)
    );

    // Iterate over each available slot
    available.forEach(({ start: availableStart, end: availableEnd }) => {
      let currentStart = convertToMinutes(availableStart);
      const endLimit = convertToMinutes(availableEnd);

      // Iterate over each scheduled slot and split the available slot accordingly
      scheduled.forEach(({ start: scheduledStart, end: scheduledEnd }) => {
        const scheduledStartMinutes = convertToMinutes(scheduledStart);
        const scheduledEndMinutes = convertToMinutes(scheduledEnd);

        // If the scheduled slot starts after the current available end, skip
        if (scheduledStartMinutes >= endLimit) return;

        // If the scheduled slot ends before the current available start, skip
        if (scheduledEndMinutes <= currentStart) return;

        // If there is a gap before the scheduled slot starts
        if (scheduledStartMinutes > currentStart) {
          const duration = scheduledStartMinutes - currentStart;
          if (duration >= 30) {
            // Only add slots that are at least 30 minutes
            availableSlots.push({
              start: formatTime(currentStart),
              end: formatTime(scheduledStartMinutes - 1),
            });
          }
        }

        // Move the start time forward to the end of the scheduled slot
        currentStart = Math.max(currentStart, scheduledEndMinutes);
      });

      // Add any remaining availability after the last scheduled slot
      if (currentStart < endLimit) {
        const duration = endLimit - currentStart;
        if (duration >= 30) {
          // Only add slots that are at least 30 minutes
          availableSlots.push({
            start: formatTime(currentStart),
            end: formatTime(endLimit),
          });
        }
      }
    });

    return availableSlots;
  };

  // Format minutes to "HH:MM"
  const formatTime = (minutes) => {
    const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mins = String(minutes % 60).padStart(2, "0");
    return `${hours}:${mins}`;
  };

  // Find available slots by removing scheduled intervals
  return getAvailableSlots(dailyAvailableSlots, scheduledSlots);
};

const findCommonAvailableSlots = (availabilityByDate) => {
  const result = {};

  for (const date in availabilityByDate) {
    const dailySlots = availabilityByDate[date];
    const allUserIds = Object.keys(dailySlots);

    // Skip the date if any participant has an empty availability array
    if (allUserIds.some((id) => dailySlots[id].length === 0)) {
      continue; // Skip this date entirely
    }

    // Collect and sort all slots across participants for this date
    let allSlots = [];
    allUserIds.forEach((id) => {
      allSlots = allSlots.concat(dailySlots[id]);
    });

    // Sort slots by start time
    allSlots.sort((a, b) => {
      const [startHourA, startMinuteA] = a.start.split(":").map(Number);
      const [startHourB, startMinuteB] = b.start.split(":").map(Number);
      return startHourA !== startHourB
        ? startHourA - startHourB
        : startMinuteA - startMinuteB;
    });

    // Merge overlapping slots while maintaining distinct slots when there are gaps
    const mergedSlots = [];
    let currentSlot = null;

    allSlots.forEach((slot) => {
      if (!currentSlot) {
        currentSlot = { ...slot };
        return;
      }

      const [currentEndHour, currentEndMinute] = currentSlot.end
        .split(":")
        .map(Number);
      const [slotStartHour, slotStartMinute] = slot.start
        .split(":")
        .map(Number);
      const [slotEndHour, slotEndMinute] = slot.end.split(":").map(Number);

      const currentEndInMinutes = currentEndHour * 60 + currentEndMinute;
      const slotStartInMinutes = slotStartHour * 60 + slotStartMinute;

      // Only merge slots if they overlap or are contiguous; otherwise, separate
      if (slotStartInMinutes > currentEndInMinutes) {
        // There is a gap; push the currentSlot and start a new one
        mergedSlots.push(currentSlot);
        currentSlot = { ...slot };
      } else {
        // Merge slots by extending the end time if needed
        const slotEndInMinutes = slotEndHour * 60 + slotEndMinute;
        if (slotEndInMinutes > currentEndInMinutes) {
          currentSlot.end = slot.end; // Extend the end time
        }
      }
    });

    // Add the last slot if present
    if (currentSlot) {
      mergedSlots.push(currentSlot);
    }

    // Filter out slots that are shorter than 30 minutes
    const filteredSlots = mergedSlots.filter((slot) => {
      const [startHour, startMinute] = slot.start.split(":").map(Number);
      const [endHour, endMinute] = slot.end.split(":").map(Number);
      const startInMinutes = startHour * 60 + startMinute;
      const endInMinutes = endHour * 60 + endMinute;
      return endInMinutes - startInMinutes >= 30;
    });

    // Add the filtered slots to the result for this date if not empty
    if (filteredSlots.length > 0) {
      result[date] = filteredSlots;
    }
  }

  return result;
};

function scheduleSlots(slotsByDate,commonSlotsAvailable) {
  const scheduledSlots = {};

  for (const date in commonSlotsAvailable) {
    const availableSlots = commonSlotsAvailable[date];
    const slotsRequired = slotsByDate[date];  // Get the number of slots to schedule for that date

    let slotIndex = 0;
    const dateSlots = [];

    // Iterate over the available time slots for the given date
    availableSlots.forEach((slot) => {
      const startTime = slot.start;
      const endTime = slot.end;

      // Convert start and end time (in milliseconds) to readable time
      let start = parseTimeToDate(startTime);
      const end = parseTimeToDate(endTime);
      
      // While there are slots to schedule and the current slot hasn't reached the required count
      while (start < end && slotIndex < slotsRequired) {
        // Calculate the end time for the slot (30 minutes later)
        const nextSlotEnd = new Date(start.getTime() + 30 * 60000);

        dateSlots.push({ start: formatTime(start), end: formatTime(nextSlotEnd) });

        start = nextSlotEnd;
        slotIndex++;
      }
    });

    // If we have scheduled slots for the date, add them to the result
    if (dateSlots.length > 0) {
      scheduledSlots[date] = dateSlots;
    }
  }

  return scheduledSlots;
}

const checkParticipantAvailableSlots = ({
  participant_ids,
  date_range,
  data,
}) => {
  const availabilityByDate = {};
  let slotsByDate = {};

  const { participants, participantAvailability, schedules } = data;

  const startDate = reformatDate(date_range.start); // Convert start date to dd-mm-yyyy
  const endDate = reformatDate(date_range.end); // Convert end date to dd-mm-yyyy
  const dateList = generateDateRange(startDate, endDate); // Generate a list of dates in the range

  // Iterate over each date in the date range
  dateList.forEach((date) => {
    const dailyAvailabilityResult = {}; // Stores available slots per participant on this date

    participant_ids.forEach((id) => {
      const userSchedule = schedules[id]?.[date] || [];
      const dailyAvailableSlots =
        participantAvailability[id]?.[getDayOfWeek(date)] || [];

      // Calculate total scheduled slots for the user
      const slotCount = countThirtyMinuteIntervals(userSchedule);
      const threshold = participants[id].threshold;
      const slotsRemaining = threshold - slotCount;

      if (slotsByDate[date] !== undefined) {
        const existingSlotsRemaining = slotsByDate[date];
        const newSlotsRemaining = Math.min(existingSlotsRemaining, slotsRemaining);
        
        slotsByDate[date] = newSlotsRemaining === 0 ? 0 : newSlotsRemaining;
      } else {
        slotsByDate[date] = slotsRemaining;
      }

      // Find available slots by removing scheduled slots
      if (slotsRemaining > 0) {
        dailyAvailabilityResult[id] = findAvailableSlots(
          dailyAvailableSlots,
          userSchedule
        );
      } else {
        dailyAvailabilityResult[id] = [];
      }
    });

    availabilityByDate[date] = dailyAvailabilityResult;
  });

  const commonSlotsAvailable = findCommonAvailableSlots(availabilityByDate);

  const result=scheduleSlots(slotsByDate,commonSlotsAvailable)

  return result;
};


// ********** Data from redis ************


// Helper function to get data from Redis
async function getDataFromRedis() {
  const participants = JSON.parse(await redis.get("participants"));
  const participantAvailability = JSON.parse(
    await redis.get("participantAvailability")
  );
  const schedules = JSON.parse(await redis.get("schedules"));
  return { participants, participantAvailability, schedules };
}


// ********** Api Route Handling ************


// API Route Handler
export async function POST(request) {
  try {
    const { participant_ids, date_range } = await request.json();
    const data = await getDataFromRedis();

    const availableSlots = checkParticipantAvailableSlots({
      participant_ids,
      date_range,
      data,
    });
    return NextResponse.json({ success: true, availableSlots });
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
