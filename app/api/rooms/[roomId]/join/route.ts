import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const body = await request.json();
    const { uid, playerName, avatar } = body;

    if (!uid || !playerName) {
      return NextResponse.json(
        { error: "uid and playerName required" },
        { status: 400 }
      );
    }

    if (!avatar || !avatar.emoji || !avatar.bgColor) {
      return NextResponse.json(
        { error: "avatar with emoji and bgColor required" },
        { status: 400 }
      );
    }

    const roomRef = adminDb.collection("rooms").doc(params.roomId);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const room = roomSnap.data()!;
    if (room.status !== "waiting") {
      return NextResponse.json(
        { error: "Room is no longer accepting players" },
        { status: 400 }
      );
    }

    // Check player count
    const playersSnap = await roomRef.collection("players").get();
    if (playersSnap.size >= room.maxPlayers) {
      return NextResponse.json({ error: "Room is full" }, { status: 400 });
    }

    const isHost = room.hostSessionId === uid;

    await roomRef.collection("players").doc(uid).set({
      uid,
      playerName,
      isHost,
      avatar: {
        emoji: avatar.emoji,
        bgColor: avatar.bgColor,
      },
      score: 0,
      streak: 0,
      bestStreak: 0,
      currentRoundAnswer: null,
      roundHistory: [],
      joinedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error joining room:", error);
    return NextResponse.json({ error: "Failed to join room" }, { status: 500 });
  }
}
