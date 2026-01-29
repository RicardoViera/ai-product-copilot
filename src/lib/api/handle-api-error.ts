import { NextResponse } from "next/server";

export function handleApiError(err: unknown) {
  if (err instanceof Error) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (err.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (err.message === "BAD_REQUEST") {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
  }

  console.error("Unhandled API error:", err);

  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
