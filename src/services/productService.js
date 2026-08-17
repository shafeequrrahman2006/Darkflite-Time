import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  onSnapshot 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";

const PRODUCTS_COLLECTION = "products";

export const DEFAULT_PRODUCTS = [
  {
    name: "The Chronos Ascent V2",
    price: 9850,
    description: "Precision engineering meets timeless elegance. Featuring an in-house automatic movement and a meticulously finished dial, designed for those who appreciate true craftsmanship.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    badge: "New Arrival",
    createdAt: Date.now()
  },
  {
    name: "Oceanic Deep Diver",
    price: 3450,
    description: "Water-resistant up to 300m, featuring an unidirectional ceramic bezel, luminescent hands, and heavy-duty steel casing.",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop",
    badge: null,
    createdAt: Date.now() - 1000
  },
  {
    name: "Heritage Ultra Thin",
    price: 7800,
    description: "A timeless classic with a profile of just 6.5mm, crafted in 18k rose gold with an alligator leather strap.",
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop",
    badge: "Limited Edition",
    createdAt: Date.now() - 2000
  },
  {
    name: "Aero Chronograph S",
    price: 5200,
    description: "High-performance flyback chronograph featuring a skeletonized dial, titanium grade 5 case, and shock protection.",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop",
    badge: null,
    createdAt: Date.now() - 3000
  },
  {
    name: "Aviator Classic",
    price: 2950,
    description: "Inspired by aviation history, offering unparalleled legibility, anti-magnetic inner cage, and distressed calfskin band.",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop",
    badge: null,
    createdAt: Date.now() - 4000
  },
  {
    name: "Chronographe Royal 1952",
    price: 4250,
    description: "Vintage inspired 1952 tribute timepiece with deep crimson rouge sunburst dial and exhibition caseback.",
    imageUrl: "https://images.unsplash.com/photo-1547996160-012745cc5836?q=80&w=1000&auto=format&fit=crop",
    badge: "Heritage Collection",
    createdAt: Date.now() - 5000
  }
];

// File to Base64 helper for offline or storage fallback
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Subscribe to products list in real-time
export const subscribeProducts = (callback) => {
  const productsRef = collection(db, PRODUCTS_COLLECTION);

  return onSnapshot(productsRef, (snapshot) => {
    const products = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        // normalize timestamp for sorting
        createdTime: data.createdAt?.seconds ? data.createdAt.seconds * 1000 : (typeof data.createdAt === 'number' ? data.createdAt : Date.now())
      };
    });

    // Client-side sort descending by creation time
    products.sort((a, b) => b.createdTime - a.createdTime);
    callback(products);
  }, (error) => {
    console.error("Firestore products snapshot error:", error);
    // Fallback one-time fetch if listener errors out
    getDocs(productsRef).then((snap) => {
      const prods = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(prods);
    }).catch(() => callback([]));
  });
};

// Add a new product to Firestore
export const addProduct = async (productData, imageFile = null) => {
  let finalImageUrl = productData.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop";

  // Upload image to Firebase Storage if a File object was provided, or fallback to Base64
  if (imageFile && imageFile instanceof File) {
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      finalImageUrl = await getDownloadURL(uploadResult.ref);
    } catch (err) {
      console.warn("Storage upload fallback to Base64 encoding:", err);
      try {
        finalImageUrl = await fileToBase64(imageFile);
      } catch (b64Err) {
        console.error("Base64 conversion failed:", b64Err);
      }
    }
  }

  const newDoc = {
    name: productData.name,
    price: Number(productData.price),
    description: productData.description || "",
    imageUrl: finalImageUrl,
    badge: productData.badge || null,
    createdAt: Date.now() // Use numeric timestamp for instant sorting consistency
  };

  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), newDoc);
  return { id: docRef.id, ...newDoc };
};

// Delete product
export const deleteProduct = async (productId) => {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
};

// Seed initial products if collection is empty
export const seedInitialProductsIfEmpty = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (querySnapshot.empty) {
      console.log("Seeding default luxury products into Firestore...");
      for (const item of DEFAULT_PRODUCTS) {
        await addDoc(collection(db, PRODUCTS_COLLECTION), item);
      }
    }
  } catch (err) {
    console.error("Failed to seed initial products:", err);
  }
};
