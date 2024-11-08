import redisClient from "../lib/redis.js";

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

// Function to seed data to Redis
const seedDataToRedis = async () => {
  try {
    // Store participants
    await redisClient.set("participants", JSON.stringify(participants));

    // Store participant availability
    await redisClient.set(
      "participantAvailability",
      JSON.stringify(participantAvailability)
    );

    // Store schedules
    await redisClient.set("schedules", JSON.stringify(schedules));

    console.log("Data seeded to Redis successfully!");
  } catch (err) {
    console.error("Error seeding data to Redis:", err);
  } finally {
    // Close the Redis connection after seeding
    await redisClient.quit();
  }
};

// Call the seed function
seedDataToRedis();
