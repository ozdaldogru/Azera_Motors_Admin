import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoDB";
import Transmission from "@/lib/models/Transmission";


export const GET = async (req: NextRequest, props: { params: Promise<{ transmissionID: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const transmission = await Transmission.findById(params.transmissionID);

    if (!transmission) {
      return new NextResponse(
        JSON.stringify({ message: "Transmission not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(transmission, { status: 200 });
  } catch (err) {
    console.log("[transmissionID_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ transmissionID: string }> }) => {
  const params = await props.params;
  try {
    const  userId = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let transmission = await Transmission.findById(params.transmissionID);

    if (!transmission) {
      return new NextResponse("Transmission not found", { status: 404 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    transmission = await Transmission.findByIdAndUpdate(
      params.transmissionID,
      { title },
      { new: true }
    );

    await transmission.save();

    return NextResponse.json(transmission, { status: 200 });
  } catch (err) {
    console.log("[transmissionID_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ transmissionID: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await Transmission.findByIdAndDelete(params.transmissionID);
   
    return new NextResponse("Transmission is deleted", { status: 200 });
  } catch (err) {
    console.log("[transmissionID_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
