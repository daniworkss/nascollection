import { Firebase_db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore"; 

export default async function handler(req, res) {
  // Check if the method is GET
  if (req.method === "GET") {
    const { id } = req.query; // Extract product ID from the query parameter

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" }); // Handle case where ID is missing
    }

    try {
      // get product information using the id
      const product = await getDoc(doc(Firebase_db,'products', id));
      if (!product.exists()) {
        return res.status(404).json({ message: "Product not found" }); // Handle case where the product does not exist
      }
   
      return res.status(200).json({...product.data()}); // add storename & phone number for real estate to the product data
    } catch (error) {
      // Catch any errors and return them
      console.error("Error fetching product:", error);
      return res.status(500).json({ message: "Error fetching product" });
    }
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Method not allowed" });
  }
}
