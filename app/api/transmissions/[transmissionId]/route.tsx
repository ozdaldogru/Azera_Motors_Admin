import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoDB";
import Transmission from "@/lib/models/Transmission";


export const GET = async (req: NextRequest, { params }: { params: { transmissionId: string } }) => {
  try {
    await connectToDB();

    const { transmissionId } = params;

    if (!transmissionId) {
      return new NextResponse(JSON.stringify({ message: "Transmission ID is required" }), { status: 400 });
    }

    const transmission = await Transmission.findById(transmissionId);

    if (!transmission) {
      return new NextResponse(JSON.stringify({ message: "Transmission not found" }), { status: 404 });
    }

    return NextResponse.json(transmission, { status: 200 });
  } catch (err) {
    console.log("[transmissionId_GET]", err);
    return new NextResponse(JSON.stringify({ message: "Internal error" }), { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: { transmissionId: string } }) => {
  try {
    const { transmissionId } = params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
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

    return new NextResponse(JSON.stringify({ message: "Success" }), { status: 200 });
  } catch (err) {
    console.log("[transmissionId_POST]", err);
    return new NextResponse(JSON.stringify({ message: "Internal error" }), { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ transmissionId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await Transmission.findByIdAndDelete(params.transmissionId);
   
    return new NextResponse("Transmission is deleted", { status: 200 });
  } catch (err) {
    console.log("[transmissionId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
