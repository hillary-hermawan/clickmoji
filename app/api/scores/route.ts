import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerName, roundsSurvived, gameMode, roomId } = body;

    if (!playerName || roundsSurvived === undefined || !gameMode) {
      return NextResponse.json(
        { error: "playerName, roundsSurvived, and gameMode required" },
        { status: 400 }
      );
    }

    const docRef = await adminDb.collection("scores").add({
      playerName,
      roundsSurvived,
      gameMode,
      roomId: roomId || null,
      playedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ scoreId: docRef.id });
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json({ error: "Failed to submit score" }, { status: 500 });
  }
}
