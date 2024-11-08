import connectToRedis from "@/lib/redis";
import { NextResponse } from "next/server";

const fetchParticipantsFromRedis = async () => {
  try {
    const redis = await connectToRedis(); // Moved this here to ensure a fresh connection each call
    const participantsData = await redis.get('participants');
    if (!participantsData) return {};

    return JSON.parse(participantsData);
  } catch (err) {
    console.error('Error fetching participants from Redis:', err);
    return [];
  }
};

export async function GET(request) {
  try {
    const participants = await fetchParticipantsFromRedis();
    return NextResponse.json({ success: true, participants });
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
