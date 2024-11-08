export const participants = {
  1: { name: "Adam", threshold: 4 },
  2: { name: "Bosco", threshold: 4 },
  3: { name: "Catherine", threshold: 5 },
};

export const participantAvailability = {
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

export const schedules = {
  1: {
    "28/10/2024": [
      { start: "09:30", end: "10:30" },
      {
        start: "15:00",
        end: "16:30",
      },
    ],
  },
  2: {
    "28/10/2024": [{ start: "13:00", end: "13:30" }],
    "29/10/2024": [{ start: "09:00", end: "10:30" }],
  },
};

export async function fetchAvailableSlots(input) {
  // Placeholder function to simulate slot fetching logic.
  // Replace this logic with API call or calculation logic as described in your BRD.
  return {
    "11/10/2024": ["09:00-09:30", "10:30-11:00"],
    "12/10/2024": ["10:30-11:00"],
  };
}
