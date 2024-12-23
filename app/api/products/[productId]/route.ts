import Feature from "@/lib/models/Feature";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, props: { params: Promise<{ productId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const product = await Product.findById(params.productId)
    .populate({ path: "features", model: Feature  })
   
    ;

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }
    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[productId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ productId: string }> }) => {
  const params = await props.params;
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    const {
      title,
      make,
      price,
      features,
      status,
      condition,
      numberofowner,
      year,
      mileage,
      lowmileage,
      driveType,
      fuelType,
      consumption,
      transmission,
      engineSize,
      cylinder,
      color,
      interiorColor,
      door,
      description,
      media,
      categories,
    } = await req.json();

    if (!title || !description || !media || !price || !make) {
      return new NextResponse("Not enough data to create a new product", {
        status: 400,
      });
    }

    const addedFeatures = features.filter(
      (featureId: string) => !product.features.includes(featureId)
    );


    // included in new data, but not included in the previous data


    const removedFeatures = product.features.filter(
      (featureId: string) => !product.features.includes(featureId)
    );


    // included in previous data, but not included in the new data

    // Update Features
    await Promise.all([
      // Update added features with this product
      ...addedFeatures.map((featureId: string) =>
        Feature.findByIdAndUpdate(featureId, {
          $push: { products: product._id },
        })
      ),



      // Update removed Features without this product
      ...removedFeatures.map((featureId: string) =>
        Feature.findByIdAndUpdate(featureId, {
          $pull: { products: product._id },
        })
      ),

    ]);

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        make,
        price,
        features,
        status,
        condition,
        numberofowner,
        year,
        mileage,
        lowmileage,
        driveType,
        fuelType,
        consumption,
        transmission,
        engineSize,
        cylinder,
        color,
        interiorColor,
        door,
        description,
        media,
        categories,
      },
      { new: true }
    ).populate({ path: "features", model: Feature })
 
    
    ;

    await updatedProduct.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ productId: string }> }) => {
  const params = await props.params;
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(product._id);

    // Update features
    await Promise.all(
      product.features.map((featureId: string) =>
        Feature.findByIdAndUpdate(featureId, {
          $pull: { products: product._id },
        })
      )
    );



    return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

