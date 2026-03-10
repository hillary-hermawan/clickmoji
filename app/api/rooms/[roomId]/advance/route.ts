import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const body = await request.json();
    const { uid, phase } = body;

    if (!uid) {
      return NextResponse.json({ error: "uid required" }, { status: 400 });
    }

    if (!phase || !["results", "next"].includes(phase)) {
      return NextResponse.json(
        { error: "phase must be 'results' or 'next'" },
        { status: 400 }
      );
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
        { error: "Only the host can advance the round" },
        { status: 403 }
      );
    }

    if (room.status !== "playing") {
      return NextResponse.json(
        { error: "Game is not in playing state" },
        { status: 400 }
      );
    }

    if (phase === "results") {
      await roomRef.update({
        roundPhase: "results",
      });

      return NextResponse.json({ success: true });
    }

    // phase === "next"
    const nextRound = (room.currentRound || 0) + 1;
    const totalRounds = room.settings?.rounds ?? 10;

    if (nextRound > totalRounds) {
      // Game is finished
      await roomRef.update({
        status: "finished",
        roundPhase: null,
        finishedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true, finished: true });
    }

    // Advance to next round — update room and reset all players' currentRoundAnswer
    const batch = adminDb.batch();

    batch.update(roomRef, {
      currentRound: nextRound,
      roundPhase: "question",
      roundStartedAt: FieldValue.serverTimestamp(),
    });

    // Reset all players' currentRoundAnswer to null
    const playersSnap = await roomRef.collection("players").get();

    playersSnap.forEach((playerDoc) => {
      batch.update(playerDoc.ref, {
        currentRoundAnswer: null,
      });
    });

    await batch.commit();

    return NextResponse.json({ success: true, currentRound: nextRound });
  } catch (error) {
    console.error("Error advancing round:", error);
    return NextResponse.json({ error: "Failed to advance round" }, { status: 500 });
  }
}
