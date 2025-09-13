import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import DriveType from "@/lib/models/DriveType";
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

    const existingDriveType = await DriveType.findOne({ title });

    if (existingDriveType) {
      return new NextResponse("DriveType already exists", { status: 400 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const newDriveType = await DriveType.create({
      title,
    });

    await newDriveType.save();

    return NextResponse.json(newDriveType, { status: 200 });
  } catch (err) {
    console.log("[drivetypes_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const drivetypes = await DriveType.find().sort({ createdAt: "desc" });

    return NextResponse.json(drivetypes, { status: 200 });
  } catch (err) {
    console.log("[drivetypes_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
