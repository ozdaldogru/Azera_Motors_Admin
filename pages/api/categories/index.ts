import { connectToDB } from "@/lib/mongoDB";
import Category from "@/lib/models/Category";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  if (req.method === "GET") {
    try {
      const categories = await Category.find().sort({ createdAt: "desc" });
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(categories);
    } catch (err) {
      console.log("[categories_GET]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const existingCategory = await Category.findOne({ title });
      if (existingCategory) {
        return res.status(400).json({ error: "Category already exists" });
      }

      const newCategory = await Category.create({ title });
      await newCategory.save();

      return res.status(200).json(newCategory);
    } catch (err) {
      console.log("[categories_POST]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
