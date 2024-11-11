import connectToRedis from "../lib/redis.js";

/*export const participants = {
  1: { name: "Adam", threshold: 15 },
  2: { name: "Bosco", threshold: 4 },
  3: { name: "Catherine", threshold: 5 },
};

export const participantAvailability = {
  1: {
    Monday: [
      { start: "09:10", end: "12:29" },
      { start: "14:00", end: "16:30" },
    ],
    Tuesday: [{ start: "09:11", end: "18:15" }],
  },
  2: {
    Monday: [{ start: "09:09", end: "12:35" }],
    Tuesday: [{ start: "08:45", end: "11:30" },{start:"15:00",end:"18:32"}],
  },
  3: {
    Monday: [{ start: "09:00", end: "18:00" }],
    Tuesday: [{ start: "09:00", end: "18:00" }],
  },
};

export const schedules = {
  1: {
    "28-10-2024": [
      { start: "09:30", end: "10:30" },
      {
        start: "15:00",
        end: "16:00",
      },
    ],
  },
  2: {
    "28-10-2024": [{ start: "13:00", end: "13:30" }],
    "29-10-2024": [{ start: "09:00", end: "10:30" }],
  },
};*/

// Function to seed data to Redis
const seedDataToRedis = async () => {
  const redis = await connectToRedis();

  try {

    await redis.set("participants", JSON.stringify(participants));
    await redis.set("participantAvailability", JSON.stringify(participantAvailability));
    await redis.set("schedules", JSON.stringify(schedules));

    console.log("Data seeded to Redis successfully!");
  } catch (err) {
    console.error("Error seeding data to Redis:", err);
  } finally {
    await redis.quit();
  }
};

seedDataToRedis();


// Local Participant and availability data
const participants = {
  1: { name: "Adam", threshold: 4 },
  2: { name: "Bosco", threshold: 4 },
  3: { name: "Catherine", threshold: 5 },
};

const participantAvailability = {
  1: {
    Monday: [
      { start: "09:10", end: "12:29" },
      { start: "14:00", end: "16:30" },
    ],
    Tuesday: [{ start: "09:11", end: "18:15" }],
  },
  2: {
    Monday: [{ start: "09:09", end: "12:35" }],
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