import { connectToDB } from "@/lib/mongoDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Update path if needed
import { NextRequest, NextResponse } from "next/server";
import Category from "@/lib/models/Category";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }
  return session.user;
}

export const POST = async (req: NextRequest) => {
  try {
    const user = await requireAuth();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectToDB();

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const existingCategory = await Category.findOne({ title });

    if (existingCategory) {
      return new NextResponse("Category already exists", { status: 400 });
    }

    const newCategory = await Category.create({ title });

    await newCategory.save();

    return NextResponse.json(newCategory, { status: 200 });
  } catch (err) {
    console.log("[categories_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const categories = await Category.find().sort({ createdAt: "desc" });

    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.log("[categories_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";