import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
      // Look up by code
      const snap = await adminDb
        .collection("rooms")
        .where("code", "==", code)
        .get();
      if (snap.empty) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }
      const roomDoc = snap.docs[0];
      return NextResponse.json({ id: roomDoc.id, ...roomDoc.data() });
    }

    // Look up by ID
    const roomSnap = await adminDb.collection("rooms").doc(params.roomId).get();

    if (!roomSnap.exists) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ id: roomSnap.id, ...roomSnap.data() });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 });
  }
}
