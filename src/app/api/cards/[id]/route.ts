import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "../../auth/getAuthUser";
import { cards, persistCards } from "../store";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const card = cards.get(id);
  if (!card || card.userId !== user.id) {
    return NextResponse.json({ message: "Card not found" }, { status: 404 });
  }
  cards.delete(id);
  persistCards();
  return NextResponse.json({ success: true });
}
