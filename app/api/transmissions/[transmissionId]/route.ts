import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoDB";
import Transmission from "@/lib/models/Transmission";
import mongoose from "mongoose";

export const GET = async (
  req: NextRequest,
  props: { params: { transmissionId: string } }
) => {
  const { transmissionId } = props.params;
  try {
    await connectToDB();

    // Validate ObjectId
    if (!transmissionId || !mongoose.Types.ObjectId.isValid(transmissionId)) {
      return NextResponse.json(
        { message: "Invalid or missing transmissionId" },
        { status: 400 }
      );
    }

    const transmission = await Transmission.findById(transmissionId);

    if (!transmission) {
      return NextResponse.json(
        { message: "Transmission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transmission, { status: 200 });
  } catch (err) {
    console.log("[transmissionId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  props: { params: { transmissionId: string } }
) => {
  const { transmissionId } = props.params;
  try {
    const userId = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Validate ObjectId
    if (!transmissionId || !mongoose.Types.ObjectId.isValid(transmissionId)) {
      return NextResponse.json(
        { message: "Invalid or missing transmissionId" },
        { status: 400 }
      );
    }

    let transmission = await Transmission.findById(transmissionId);

    if (!transmission) {
      return new NextResponse("Transmission not found", { status: 404 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    transmission = await Transmission.findByIdAndUpdate(
      transmissionId,
      { title },
      { new: true }
    );

    await transmission.save();

    return NextResponse.json(transmission, { status: 200 });
  } catch (err) {
    console.log("[transmissionId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  props: { params: { transmissionId: string } }
) => {
  const { transmissionId } = props.params;
  try {
    const userId = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Validate ObjectId
    if (!transmissionId || !mongoose.Types.ObjectId.isValid(transmissionId)) {
      return NextResponse.json(
        { message: "Invalid or missing transmissionId" },
        { status: 400 }
      );
    }

    await Transmission.findByIdAndDelete(transmissionId);

    return new NextResponse("Transmission is deleted", { status: 200 });
  } catch (err) {
    console.log("[transmissionId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";