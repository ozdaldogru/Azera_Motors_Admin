import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;

  if (req.method === "GET") {
    try {
      await connectToDB()

      const searchedProducts = await Product.find({
        $or: [
          { model: { $regex: query, $options: "i" } },
          { make: { $regex: query, $options: "i" } },
          { driveType: { $regex: query, $options: "i" } },
          { fuelType: { $regex: query, $options: "i" } },
          { transmission: { $regex: query, $options: "i" } },
          { color: { $regex: query, $options: "i" } },
          { interiorColor: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { categories: { $regex: query, $options: "i" } },
          { vin: { $regex: query, $options: "i" } },

        ]
      })

      return res.status(200).json(searchedProducts);
    } catch (err) {
      console.log("[search_GET]", err)
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export const dynamic = "force-dynamic";
