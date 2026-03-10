import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from "firebase/firestore";

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const db = getDb();
    const body = await request.json();
    const { uid, playerName } = body;

    if (!uid || !playerName) {
      return NextResponse.json(
        { error: "uid and playerName required" },
        { status: 400 }
      );
    }

    const roomRef = doc(db, "rooms", params.roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const room = roomSnap.data();
    if (room.status !== "waiting") {
      return NextResponse.json(
        { error: "Room is no longer accepting players" },
        { status: 400 }
      );
    }

    // Check player count
    const playersSnap = await getDocs(
      collection(db, "rooms", params.roomId, "players")
    );
    if (playersSnap.size >= room.maxPlayers) {
      return NextResponse.json({ error: "Room is full" }, { status: 400 });
    }

    const isHost = room.hostSessionId === uid;

    await setDoc(
      doc(db, "rooms", params.roomId, "players", uid),
      {
        uid,
        playerName,
        isHost,
        currentRound: 0,
        isAlive: true,
        joinedAt: serverTimestamp(),
        eliminatedAt: null,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error joining room:", error);
    return NextResponse.json({ error: "Failed to join room" }, { status: 500 });
  }
}
