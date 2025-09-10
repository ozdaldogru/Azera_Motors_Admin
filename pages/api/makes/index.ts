import { connectToDB } from "@/lib/mongoDB";
import Make from "@/lib/models/Make";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  if (req.method === "GET") {
    try {
      const makes = await Make.find().sort({ createdAt: "desc" });
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(makes);
    } catch (err) {
      console.log("[makes_GET]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const existingMake = await Make.findOne({ title });
      if (existingMake) {
        return res.status(400).json({ error: "Make already exists" });
      }

      const newMake = await Make.create({ title });
      await newMake.save();

      return res.status(200).json(newMake);
    } catch (err) {
      console.log("[makes_POST]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
