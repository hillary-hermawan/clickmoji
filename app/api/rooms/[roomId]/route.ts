import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
      // Look up by code
      const q = query(collection(db, "rooms"), where("code", "==", code));
      const snap = await getDocs(q);
      if (snap.empty) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }
      const roomDoc = snap.docs[0];
      return NextResponse.json({ id: roomDoc.id, ...roomDoc.data() });
    }

    // Look up by ID
    const roomRef = doc(db, "rooms", params.roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ id: roomSnap.id, ...roomSnap.data() });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 });
  }
}
