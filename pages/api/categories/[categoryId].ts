import { connectToDB } from "@/lib/mongoDB";
import Category from "@/lib/models/Category";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  const { categoryId } = req.query;

  if (req.method === "GET") {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(category);
    } catch (err) {
      console.log("[category_GET]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // You can add PUT, DELETE, etc. here as needed

  return res.status(405).json({ error: "Method not allowed" });
}
