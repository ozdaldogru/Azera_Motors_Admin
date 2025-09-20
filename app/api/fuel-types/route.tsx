import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import FuelType from "@/lib/models/FuelType";
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

    const existingFuelType = await FuelType.findOne({ title });

    if (existingFuelType) {
      return new NextResponse("FuelType already exists", { status: 400 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const newFuelType = await FuelType.create({
      title,
    });

    await newFuelType.save();

    return NextResponse.json(newFuelType, { status: 200 });
  } catch (err) {
    console.log("[fuel-types_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const fueltypes = await FuelType.find().sort({ createdAt: "desc" });

    return NextResponse.json(fueltypes, { status: 200 });
  } catch (err) {
    console.log("[fuel-types_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";