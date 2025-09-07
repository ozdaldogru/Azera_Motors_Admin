import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import Status from "@/lib/models/Status";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();

    const { title } = await req.json();

    const existingStatus = await Status.findOne({ title });

    if (existingStatus) {
      return new NextResponse("Status is already exists", { status: 400 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const newStatus = await Status.create({
      title,
    });

    await newStatus.save();

    return NextResponse.json(newStatus, { status: 200 });
  } catch (err) {
    console.log("[statuses_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const statuses = await Status.find().sort({ createdAt: "desc" });

    return NextResponse.json(statuses, { status: 200 });
  } catch (err) {
    console.log("[statuses_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
