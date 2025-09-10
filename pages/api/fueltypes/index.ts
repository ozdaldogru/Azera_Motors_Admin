import { connectToDB } from "@/lib/mongoDB";
import FuelType from "@/lib/models/FuelType";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  if (req.method === "GET") {
    try {
      const fueltypes = await FuelType.find().sort({ createdAt: "desc" });
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(fueltypes);
    } catch (err) {
      console.log("[fueltypes_GET]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const existingFuelType = await FuelType.findOne({ title });
      if (existingFuelType) {
        return res.status(400).json({ error: "FuelType already exists" });
      }

      const newFuelType = await FuelType.create({ title });
      await newFuelType.save();

      return res.status(200).json(newFuelType);
    } catch (err) {
      console.log("[fueltypes_POST]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
