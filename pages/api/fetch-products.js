import { doc,getDocs, collection } from "firebase/firestore";
import { Firebase_db } from "@/config/firebase";
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }   

    try {
        const snapshot = await getDocs(collection(Firebase_db, "products"));
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).json({products: products});
    } catch (error) {
        console.log(error.message, 'error fetching products');
        res.status(500).json({ error: "Error fetching products" }); 
    }

}