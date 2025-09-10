import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import Feature from "@/lib/models/Feature";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();

    const { title } = await req.json();

    const existingFeature = await Feature.findOne({ title });

    if (existingFeature) {
      return new NextResponse("Feature is already exists", { status: 400 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const newFeature = await Feature.create({ title });

    await newFeature.save();

    return NextResponse.json(newFeature, { status: 200 });
  } catch (err) {
    console.log("[features_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const features = await Feature.find().sort({ createdAt: "desc" });

    return NextResponse.json(features, { status: 200 });
  } catch (err) {
    console.log("[features_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
