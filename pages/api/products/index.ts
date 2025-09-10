import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Feature from "@/lib/models/Feature";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  if (req.method === "POST") {
    try {
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
      } = req.body;

      if (!model || !description || !media || !price || !make) {
        return res.status(400).json({ error: "Not enough data to create a product" });
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

      return res.status(200).json(newProduct);
    } catch (err) {
      console.log("[products_POST]", err);
      return res.status(500).json({ error: "Internal Error" });
    }
  }

  if (req.method === "GET") {
    try {
      const products = await Product.find()
        .sort({ createdAt: "desc" })
        .populate({ path: "features", model: Feature });

      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(products);
    } catch (err) {
      console.log("[products_GET]", err);
      return res.status(500).json({ error: "Internal Error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}