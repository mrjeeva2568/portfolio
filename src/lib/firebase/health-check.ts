import { auth, db } from "./config";
import { collection, getDocs, query, limit } from "firebase/firestore";

export async function checkFirebaseHealth() {
  try {
    console.log("🔍 Checking Firebase connection...");

    // Check auth
    const currentUser = auth.currentUser;
    console.log("✅ Auth initialized. Current user:", currentUser?.email || "None");

    // Check Firestore connection
    const testCollection = collection(db, "settings");
    const q = query(testCollection, limit(1));
    const snapshot = await getDocs(q);
    console.log("✅ Firestore accessible. Collections found:", snapshot.size);

    return {
      success: true,
      auth: !!currentUser,
      userId: currentUser?.uid,
      userEmail: currentUser?.email,
      firestoreConnected: true,
    };
  } catch (error) {
    console.error("❌ Firebase health check failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      auth: !!auth.currentUser,
      firestoreConnected: false,
    };
  }
}
