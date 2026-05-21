import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getAuthUserFromRequest } from "../auth/getAuthUser";
import { cards, persistCards } from "./store";

export async function GET(request: Request) {
  const user = getAuthUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const list = Array.from(cards.values()).filter((c) => c.userId === user.id);
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const user = getAuthUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { last4, bankName, network } = body as {
      last4?: string;
      bankName?: string;
      network?: string;
    };
    const id = randomBytes(8).toString("hex");
    const now = new Date().toISOString();
    const card = {
      id,
      userId: user.id,
      last4: String(last4 ?? "").slice(-4),
      bankName: bankName ?? null,
      network: network ?? null,
      createdAt: now,
    };
    cards.set(id, card);
    persistCards();
    return NextResponse.json(card);
  } catch (e) {
    console.error("Cards POST error:", e);
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }
}
