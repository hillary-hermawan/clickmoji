import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const body = await request.json();
    const { uid } = body;

    if (!uid) {
      return NextResponse.json({ error: "uid required" }, { status: 400 });
    }

    const roomRef = adminDb.collection("rooms").doc(params.roomId);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const room = roomSnap.data()!;

    if (room.hostSessionId !== uid) {
      return NextResponse.json(
        { error: "Only the host can start the game" },
        { status: 403 }
      );
    }

    if (room.status !== "waiting") {
      return NextResponse.json(
        { error: "Game already started or finished" },
        { status: 400 }
      );
    }

    await roomRef.update({
      status: "playing",
      currentRound: 1,
      roundPhase: "question",
      roundStartedAt: FieldValue.serverTimestamp(),
      startedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, seed: room.seed });
  } catch (error) {
    console.error("Error starting game:", error);
    return NextResponse.json({ error: "Failed to start game" }, { status: 500 });
  }
}
