import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import Make from "@/lib/models/Make";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Update path if needed

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }
  return session.user;
}

export const POST = async (req: NextRequest) => {
  try {
    const user = await requireAuth();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectToDB();

    const { title } = await req.json();

    const existingMake = await Make.findOne({ title });

    if (existingMake) {
      return new NextResponse("Make already exists", { status: 400 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const newMake = await Make.create({
      title,
    });

    await newMake.save();

    return NextResponse.json(newMake, { status: 200 });
  } catch (err) {
    console.log("[makes_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const makes = await Make.find().sort({ createdAt: "desc" });

    return NextResponse.json(makes, { status: 200 });
  } catch (err) {
    console.log("[makes_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
