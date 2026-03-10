import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function generateCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `MOJI-${num}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hostSessionId, maxPlayers = 8 } = body;

    if (!hostSessionId) {
      return NextResponse.json({ error: "hostSessionId required" }, { status: 400 });
    }

    const code = generateCode();
    const seed = Math.floor(Math.random() * 2147483647);
    const db = getDb();

    const docRef = await addDoc(collection(db, "rooms"), {
      code,
      status: "waiting",
      hostSessionId,
      seed,
      maxPlayers,
      createdAt: serverTimestamp(),
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
