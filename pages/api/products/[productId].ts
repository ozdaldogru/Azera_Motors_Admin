import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Feature from "@/lib/models/Feature";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  const { productId } = req.query;

  if (req.method === "GET") {
    try {
      const product = await Product.findById(productId).populate({ path: "features", model: Feature });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(product);
    } catch (err) {
      console.log("[product_GET]", err);
      return res.status(500).json({ error: "Internal Error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const updateData = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.status(200).json(updatedProduct);
    } catch (err) {
      console.log("[product_PUT]", err);
      return res.status(500).json({ error: "Internal Error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Product.findByIdAndDelete(productId);
      return res.status(200).json({ message: "Product deleted" });
    } catch (err) {
      console.log("[product_DELETE]", err);
      return res.status(500).json({ error: "Internal Error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}


