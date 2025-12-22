import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Feature from "@/lib/models/Feature";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Update path if needed

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

    const {
      model,
      make,
      price,
      features,
      status,
      numberofowner,
      year,
      mileage,
      driveType,
      fuelType,
      transmission,
      engineSize,
      cylinder,
      color,
      interiorColor,
      door,
      description,
      media,
      categories,
      vin,
      history,
      totalCost,
      soldPrice,
      soldDate,
    } = await req.json();

    if (!model || !description || !media || !price || !make) {
      return new NextResponse("Not enough data to create a product", {
        status: 400,
      });
    }

    const newProduct = await Product.create({
      model,
      make,
      price,
      features,
      status,
      numberofowner,
      year,
      mileage,
      driveType,
      fuelType,
      transmission,
      engineSize,
      cylinder,
      color,
      interiorColor,
      door,
      description,
      media,
      categories,
      vin,
      history,
      totalCost,
      soldPrice,
      soldDate,
    });

    await newProduct.save();

    if (features) {
      for (const featureId of features) {
        const feature = await Feature.findById(featureId);
        if (feature) {
          if (!Array.isArray(feature.products)) {
            feature.products = [];
          }
          feature.products.push(newProduct._id);
          await feature.save();
        }
      }
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "features", model: Feature });

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

