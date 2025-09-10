import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Status from "@/lib/models/Status";


export const GET = async (req: NextRequest, props: { params: Promise<{ statusId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const status = await Status.findById(params.statusId);

    if (!status) {
      return new NextResponse(
        JSON.stringify({ message: "Status not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(status, { status: 200 });
  } catch (err) {
    console.log("[statusId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ statusId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    let status = await Status.findById(params.statusId);

    if (!status) {
      return new NextResponse("Status not found", { status: 404 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    status = await Status.findByIdAndUpdate(
      params.statusId,
      { title },
      { new: true }
    );

    await status.save();

    return NextResponse.json(status, { status: 200 });
  } catch (err) {
    console.log("[statusId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ statusId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    await Status.findByIdAndDelete(params.statusId);
   
    return new NextResponse("Status is deleted", { status: 200 });
  } catch (err) {
    console.log("[statusId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
