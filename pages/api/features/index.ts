import { connectToDB } from "@/lib/mongoDB";
import Feature from "@/lib/models/Feature";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  if (req.method === "GET") {
    try {
      const features = await Feature.find().sort({ createdAt: "desc" });
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json(features);
    } catch (err) {
      console.log("[features_GET]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const existingFeature = await Feature.findOne({ title });
      if (existingFeature) {
        return res.status(400).json({ error: "Feature already exists" });
      }

      const newFeature = await Feature.create({ title });
      await newFeature.save();

      return res.status(200).json(newFeature);
    } catch (err) {
      console.log("[features_POST]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
