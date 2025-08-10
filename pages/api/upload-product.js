import { IncomingForm } from "formidable";
import { Firebase_storage, Firebase_db } from "@/config/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  return new Promise((resolve) => {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: "Error parsing form data" });
        return resolve();
      }

      try {
        const {
          name,
          description,
          price,
          inches,
          stock,
          category,
          youtubeLink,
          colors,
          prevprice,
          sizes,
          subcategory,
        } = fields;

        console.log("Received files:", files);
        console.log("Received fields:", fields);

        // Normalize image files array
        const imageFilesArray = Array.isArray(files.images)
          ? files.images
          : files.images
          ? [files.images]
          : [];

        if (imageFilesArray.length === 0) {
          res.status(400).json({ error: "No image files uploaded" });
          return resolve();
        }

        // Upload images in parallel
        const uploadPromises = imageFilesArray.map(async (imageFile) => {
          if (!imageFile.filepath) throw new Error("Invalid image file");

          const fileExtension = imageFile.originalFilename
            ? imageFile.originalFilename.split(".").pop()
            : "jpg";

          const fileName = `products/${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${fileExtension}`;

          const storageRef = ref(Firebase_storage, fileName);

          // Read file as a buffer (streaming would be possible but firebase SDK prefers buffers for `uploadBytes`)
          const imageBuffer = await fs.promises.readFile(imageFile.filepath);

          const metadata = {
            contentType: imageFile.mimetype || "image/jpeg",
            cacheControl: "public, max-age=31536000",
          };

          await uploadBytes(storageRef, imageBuffer, metadata);
          const { getDownloadURL } = await import("firebase/storage");
          return await getDownloadURL(storageRef);
        });

        const imageUrls = await Promise.all(uploadPromises);

        // Parse JSON fields safely
        const parsedColors = colors ? JSON.parse(colors.toString()) : [];
        const parsedSizes = sizes ? JSON.parse(sizes.toString()) : [];

        const productData = {
          name: name.toString(),
          category: category.toString(),
          description: description.toString(),
          prevprice: parseFloat(prevprice.toString()),
          price: parseFloat(price.toString()),
          inches: inches.toString().split(",").map((inch) => inch.trim()),
          colors: parsedColors,
          sizes: parsedSizes,
          stock: parseInt(stock.toString(), 10),
          images: imageUrls,
          subcategory: subcategory ? subcategory.toString() : null,
          youtubeLink: youtubeLink ? youtubeLink.toString() : null,
          createdAt: new Date().toISOString(),
        };

        const docRef = await addDoc(
          collection(Firebase_db, "products"),
          productData
        );

        res.status(201).json({
          message: "Product added successfully",
          id: docRef.id,
        });
      } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: error.message });
      }
      resolve();
    });
  });
}
