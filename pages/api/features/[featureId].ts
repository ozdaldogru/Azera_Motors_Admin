import { connectToDB } from "@/lib/mongoDB";
import Feature from "@/lib/models/Feature";
import Product from "@/lib/models/Product";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();
  const { featureId } = req.query;

  if (req.method === "GET") {
    try {
      const feature = await Feature.findById(featureId).populate({ path: "products", model: Product });
      if (!feature) {
        return res.status(404).json({ message: "Feature not found" });
      }
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(feature);
    } catch (err) {
      console.log("[featureId_GET]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  if (req.method === "POST") {
    try {
      let feature = await Feature.findById(featureId);
      if (!feature) {
        return res.status(404).json({ error: "Feature not found" });
      }

      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      feature = await Feature.findByIdAndUpdate(
        featureId,
        { title },
        { new: true }
      );

      await feature.save();
      return res.status(200).json(feature);
    } catch (err) {
      console.log("[featureId_POST]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Feature.findByIdAndDelete(featureId);
      await Product.updateMany(
        { features: featureId },
        { $pull: { features: featureId } }
      );
      return res.status(200).json({ message: "Feature is deleted" });
    } catch (err) {
      console.log("[featureId_DELETE]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
