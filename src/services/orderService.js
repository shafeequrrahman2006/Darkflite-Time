import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "../../firebase";

const ORDERS_COLLECTION = "orders";

export const DEFAULT_ORDERS = [
  {
    displayId: "#ORD-9021",
    customerName: "Eleanor Vance",
    initials: "EJ",
    mobileNumber: "+1 (555) 019-2834",
    shippingAddress: "1424 Hill House Rd, Boston",
    item: {
      productName: "Heritage Chronograph Ref. 410.A",
      price: 4250.00,
      imageUrl: "https://images.unsplash.com/photo-1547996160-012745cc5836?q=80&w=1000&auto=format&fit=crop"
    },
    paymentMethod: "COD",
    status: "Pending",
    createdAt: Date.now() - 1000
  },
  {
    displayId: "#ORD-9020",
    customerName: "Arthur Shelby",
    initials: "AS",
    mobileNumber: "+44 7911 123456",
    shippingAddress: "Watery Lane, Small Heath",
    item: {
      productName: "Nocturne Moonphase Ref. 802.C",
      price: 8900.00,
      imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop"
    },
    paymentMethod: "CC",
    status: "Shipped",
    createdAt: Date.now() - 2000
  },
  {
    displayId: "#ORD-9019",
    customerName: "Maria Rossi",
    initials: "MR",
    mobileNumber: "+39 345 678 9012",
    shippingAddress: "Via Monte Napoleone 8, M",
    item: {
      productName: "Aero Tourbillon Ref. 990.T",
      price: 15200.00,
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop"
    },
    paymentMethod: "Wire",
    status: "Completed",
    createdAt: Date.now() - 3000
  },
  {
    displayId: "#ORD-9018",
    customerName: "David Chen",
    initials: "DC",
    mobileNumber: "+1 (415) 555-0987",
    shippingAddress: "800 N Point St, San Franci",
    item: {
      productName: "Diver Pro 300 Ref. 210.D",
      price: 3850.00,
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop"
    },
    paymentMethod: "COD",
    status: "Pending",
    createdAt: Date.now() - 4000
  }
];

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const createOrder = async (orderPayload) => {
  const randomNum = Math.floor(9022 + Math.random() * 900);
  const displayId = orderPayload.displayId || `#ORD-${randomNum}`;

  const docData = {
    displayId: displayId,
    customerName: orderPayload.customerName,
    initials: getInitials(orderPayload.customerName),
    mobileNumber: orderPayload.mobileNumber,
    shippingAddress: orderPayload.shippingAddress,
    item: {
      productName: orderPayload.item.productName || orderPayload.item.name,
      price: Number(orderPayload.item.price),
      imageUrl: orderPayload.item.imageUrl
    },
    paymentMethod: "Cash on Delivery",
    status: "Pending",
    createdAt: Date.now()
  };

  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), docData);
  return { id: docRef.id, ...docData };
};

export const subscribeOrders = (callback) => {
  const ordersRef = collection(db, ORDERS_COLLECTION);

  return onSnapshot(ordersRef, (snapshot) => {
    const orders = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdTime: data.createdAt?.seconds ? data.createdAt.seconds * 1000 : (typeof data.createdAt === 'number' ? data.createdAt : Date.now())
      };
    });

    orders.sort((a, b) => b.createdTime - a.createdTime);
    callback(orders);
  }, (error) => {
    console.error("Firestore orders snapshot error:", error);
    getDocs(ordersRef).then((snap) => {
      const ords = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(ords);
    }).catch(() => callback([]));
  });
};

export const updateOrderStatus = async (orderDocId, newStatus) => {
  const orderRef = doc(db, ORDERS_COLLECTION, orderDocId);
  await updateDoc(orderRef, {
    status: newStatus
  });
};

export const seedInitialOrdersIfEmpty = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    if (querySnapshot.empty) {
      console.log("Seeding default luxury orders into Firestore...");
      for (const orderItem of DEFAULT_ORDERS) {
        await addDoc(collection(db, ORDERS_COLLECTION), orderItem);
      }
    }
  } catch (err) {
    console.error("Failed to seed initial orders:", err);
  }
};
