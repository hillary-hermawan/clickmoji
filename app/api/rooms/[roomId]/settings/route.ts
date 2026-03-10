import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const VALID_ROUNDS = [5, 10, 15, 20];
const VALID_TIMER_SECONDS = [10, 15, 20, 30];
const VALID_MAX_PLAYERS = [2, 3, 4];

export async function PATCH(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const body = await request.json();
    const { uid, settings: newSettings, maxPlayers } = body;

    if (!uid) {
      return NextResponse.json({ error: "uid required" }, { status: 400 });
    }

    const roomRef = adminDb.collection("rooms").doc(params.roomId);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const room = roomSnap.data()!;

    // Host-only check
    if (room.hostSessionId !== uid) {
      return NextResponse.json(
        { error: "Only the host can change settings" },
        { status: 403 }
      );
    }

    if (room.status !== "waiting") {
      return NextResponse.json(
        { error: "Settings can only be changed in the waiting room" },
        { status: 400 }
      );
    }

    // Validate settings if provided
    if (newSettings) {
      if (newSettings.rounds !== undefined && !VALID_ROUNDS.includes(newSettings.rounds)) {
        return NextResponse.json(
          { error: `rounds must be one of: ${VALID_ROUNDS.join(", ")}` },
          { status: 400 }
        );
      }

      if (newSettings.timerSeconds !== undefined && !VALID_TIMER_SECONDS.includes(newSettings.timerSeconds)) {
        return NextResponse.json(
          { error: `timerSeconds must be one of: ${VALID_TIMER_SECONDS.join(", ")}` },
          { status: 400 }
        );
      }
    }

    if (maxPlayers !== undefined && !VALID_MAX_PLAYERS.includes(maxPlayers)) {
      return NextResponse.json(
        { error: `maxPlayers must be one of: ${VALID_MAX_PLAYERS.join(", ")}` },
        { status: 400 }
      );
    }

    // Merge settings with existing
    const updateData: Record<string, unknown> = {};

    if (newSettings) {
      const existingSettings = room.settings || {};
      updateData.settings = { ...existingSettings, ...newSettings };
    }

    if (maxPlayers !== undefined) {
      updateData.maxPlayers = maxPlayers;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No settings provided to update" },
        { status: 400 }
      );
    }

    await roomRef.update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
