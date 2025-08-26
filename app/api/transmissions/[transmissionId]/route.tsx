import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoDB";
import Transmission from "@/lib/models/Transmission";

// GET transmission by ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { transmissionId: string } }
) => {
  try {
    await connectToDB();

    const transmission = await Transmission.findById(params.transmissionId);

    if (!transmission) {
      return NextResponse.json(
        { message: "Transmission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transmission, { status: 200 });
  } catch (err) {
    console.error("[transmissionId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// UPDATE transmission (e.g., title)
export const POST = async (
  req: NextRequest,
  { params }: { params: { transmissionId: string } }
) => {
  try {
    const  userId  = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let transmission = await Transmission.findById(params.transmissionId);

    if (!transmission) {
      return new NextResponse("Transmission not found", { status: 404 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    transmission = await Transmission.findByIdAndUpdate(
      params.transmissionId,
      { title },
      { new: true }
    );

    await transmission.save();

    return NextResponse.json(transmission, { status: 200 });
  } catch (err) {
    console.error("[transmissionId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// DELETE transmission by ID
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { transmissionId: string } }
) => {
  try {
    const  userId  = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await Transmission.findByIdAndDelete(params.transmissionId);

    return new NextResponse("Transmission deleted", { status: 200 });
  } catch (err) {
    console.error("[transmissionId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
