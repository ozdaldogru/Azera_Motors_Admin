import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoDB";
import DriveType from "@/lib/models/DriveType";


export const GET = async (req: NextRequest, props: { params: Promise<{ drivetypeId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const drivetype = await DriveType.findById(params.drivetypeId);

    if (!drivetype) {
      return new NextResponse(
        JSON.stringify({ message: "DriveType not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(drivetype, { status: 200 });
  } catch (err) {
    console.log("[drivetypeId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ drivetypeId: string }> }) => {
  const params = await props.params;
  try {
    const  userId = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let drivetype = await DriveType.findById(params.drivetypeId);

    if (!drivetype) {
      return new NextResponse("DriveType not found", { status: 404 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    drivetype = await DriveType.findByIdAndUpdate(
      params.drivetypeId,
      { title },
      { new: true }
    );

    await drivetype.save();

    return NextResponse.json(drivetype, { status: 200 });
  } catch (err) {
    console.log("[drivetypeId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ drivetypeId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await DriveType.findByIdAndDelete(params.drivetypeId);
   
    return new NextResponse("DriveType is deleted", { status: 200 });
  } catch (err) {
    console.log("[drivetypeId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
