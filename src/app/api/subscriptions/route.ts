import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "../auth/getAuthUser";
import { subscriptions } from "./store";

export async function GET(request: Request) {
  const user = getAuthUserFromRequest(request);
  if (!user) { 
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const list = Array.from(subscriptions.values()).filter(
      (s) => s.userId === user.id
    );
    return NextResponse.json(list);
  } catch (err) {
    console.error("[subscriptions] GET error:", err);
    return NextResponse.json([]);
  }
}
