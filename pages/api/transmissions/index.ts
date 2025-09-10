import { connectToDB } from "@/lib/mongoDB";
import Transmission from "@/lib/models/Transmission";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  if (req.method === "POST") {
    try {
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const existingTransmission = await Transmission.findOne({ title });
      if (existingTransmission) {
        return res.status(400).json({ error: "Transmission already exists" });
      }

      const newTransmission = await Transmission.create({ title });
      await newTransmission.save();

      return res.status(200).json(newTransmission);
    } catch (err) {
      console.log("[transmissions_POST]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "GET") {
    try {
      const transmissions = await Transmission.find().sort({ createdAt: "desc" });
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(transmissions);
    } catch (err) {
      console.log("[transmissions_GET]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
