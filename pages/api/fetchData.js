import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Firebase_db } from "@/config/firebase";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    console.log(req.body);
    
    try {

      // Fetch store data
      const storeDocRef = doc(Firebase_db, 'storeData', 'LoNMj1l8JSnnxyApGel7'); 
      const storeDoc = await getDoc(storeDocRef);
      const storeData = storeDoc.data()

      // Fetch products
      const productCollection = collection(Firebase_db, 'products');
      const snapshot = await getDocs(productCollection);
      
      let products = [];
      // Handle empty collection 
      if (!snapshot || snapshot.empty || snapshot.docs.length === 0) {
        products = []; // no products found
      } else {
        products = snapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            ...data
          };
        }).filter(product => product && Object.keys(product).length > 1);
      }
      

      // Response
      return res.status(200).json({ storeData, products });
      
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}