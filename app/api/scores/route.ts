import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { playerName, roundsSurvived, gameMode, roomId } = body;

    if (!playerName || roundsSurvived === undefined || !gameMode) {
      return NextResponse.json(
        { error: "playerName, roundsSurvived, and gameMode required" },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "scores"), {
      playerName,
      roundsSurvived,
      gameMode,
      roomId: roomId || null,
      playedAt: serverTimestamp(),
    });

    return NextResponse.json({ scoreId: docRef.id });
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json({ error: "Failed to submit score" }, { status: 500 });
  }
}
