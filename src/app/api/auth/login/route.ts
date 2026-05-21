import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { users, tokens } from "../store";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function createToken(): string {
  return randomBytes(32).toString("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };
    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.get(normalizedEmail);
    if (!user || user.passwordHash !== hashPassword(password)) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
    const token = createToken();
    tokens.set(token, normalizedEmail);
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        plan: "free",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
