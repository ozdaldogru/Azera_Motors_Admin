import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Feature from "@/lib/models/Feature";


export const POST = async (req: NextRequest) => {
  try {
    const {userId}  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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
      .populate({ path: "features", model: Feature })
  
      

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

