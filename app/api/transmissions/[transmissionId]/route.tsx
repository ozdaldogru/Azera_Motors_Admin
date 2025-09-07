import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Transmission from "@/lib/models/Transmission";


export const GET = async (req: NextRequest, props: { params: Promise<{ transmissionId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const transmission = await Transmission.findById(params.transmissionId);

    if (!transmission) {
      return new NextResponse(
        JSON.stringify({ message: "Transmission not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(transmission, { status: 200 });
  } catch (err) {
    console.log("[transmissionId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ transmissionId: string }> }) => {
  const params = await props.params;
  try {
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
    console.log("[transmissionId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ transmissionId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    await Transmission.findByIdAndDelete(params.transmissionId);

    return new NextResponse("Transmission is deleted", { status: 200 });
  } catch (err) {
    console.log("[transmissionId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
