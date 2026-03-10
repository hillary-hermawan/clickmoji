import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const body = await request.json();
    const { uid, targetUid } = body;

    if (!uid || !targetUid) {
      return NextResponse.json(
        { error: "uid and targetUid required" },
        { status: 400 }
      );
    }

    if (uid === targetUid) {
      return NextResponse.json(
        { error: "Cannot kick yourself" },
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
        { error: "Only the host can kick players" },
        { status: 403 }
      );
    }

    if (room.status !== "waiting") {
      return NextResponse.json(
        { error: "Players can only be kicked in the waiting room" },
        { status: 400 }
      );
    }

    // Check that target player exists
    const targetPlayerRef = roomRef.collection("players").doc(targetUid);
    const targetPlayerSnap = await targetPlayerRef.get();

    if (!targetPlayerSnap.exists) {
      return NextResponse.json(
        { error: "Player not found in room" },
        { status: 404 }
      );
    }

    // Delete the target player doc
    await targetPlayerRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error kicking player:", error);
    return NextResponse.json({ error: "Failed to kick player" }, { status: 500 });
  }
}
