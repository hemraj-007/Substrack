import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "../auth/getAuthUser";
import { cards } from "../cards/store";
import { transactions } from "./store"; 

export async function GET(request: Request) {
  const user = getAuthUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const userCardIds = new Set(
      Array.from(cards.values()).filter((c) => c.userId === user.id).map((c) => c.id)
    );
    const list = Array.from(transactions.values()).filter((tx) => userCardIds.has(tx.cardId));
    return NextResponse.json(list);
  } catch (err) {
    console.error("[transactions] GET error:", err);
    return NextResponse.json([]);
  }
}
