import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import FuelType from "@/lib/models/FuelType";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();

    const { title } = await req.json();

    const existingFuelType = await FuelType.findOne({ title });

    if (existingFuelType) {
      return new NextResponse("FuelType is already exists", { status: 400 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const newFuelType = await FuelType.create({ title });

    await newFuelType.save();

    return NextResponse.json(newFuelType, { status: 200 });
  } catch (err) {
    console.log("[fueltypes_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const fueltypes = await FuelType.find().sort({ createdAt: "desc" });

    return NextResponse.json(fueltypes, { status: 200 });
  } catch (err) {
    console.log("[fueltypes_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
