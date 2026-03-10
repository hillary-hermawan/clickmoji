import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateRoomCode } from "@/lib/game-logic";
import { DEFAULT_GAME_SETTINGS } from "@/types/game";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hostSessionId, maxPlayers: rawMaxPlayers } = body;

    if (!hostSessionId) {
      return NextResponse.json({ error: "hostSessionId required" }, { status: 400 });
    }

    const maxPlayers = Math.min(4, Math.max(2, rawMaxPlayers ?? 4));
    const seed = Math.floor(Math.random() * 2147483647);

    // Generate a unique room code (retry up to 10 times on collision)
    let code: string = "";
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      code = generateRoomCode();

      // Check for active rooms with the same code
      const existing = await adminDb
        .collection("rooms")
        .where("code", "==", code)
        .where("status", "in", ["waiting", "countdown", "playing"])
        .get();

      if (existing.empty) {
        break;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { error: "Unable to generate unique room code. Please try again." },
          { status: 500 }
        );
      }
    }

    const docRef = await adminDb.collection("rooms").add({
      code,
      status: "waiting",
      hostSessionId,
      seed,
      maxPlayers,
      currentRound: 0,
      roundPhase: null,
      roundStartedAt: null,
      settings: DEFAULT_GAME_SETTINGS,
      createdAt: FieldValue.serverTimestamp(),
      startedAt: null,
      finishedAt: null,
    });

    return NextResponse.json({
      roomId: docRef.id,
      code,
      seed,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
