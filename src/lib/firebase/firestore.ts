import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";
import { serializeData } from "./serializer";
import type { Profile, Education, Skill, Project, Certification, ContactMessage, Settings } from "@/types";

// Generic helpers
export async function getCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<(T & { id: string })[]> {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    console.log(`✅ Loaded ${snapshot.size} items from ${collectionName}`);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }));
    return data.map(item => serializeData(item));
  } catch (error) {
    console.error(`❌ Error loading ${collectionName}:`, error);
    // Return empty array on error - this allows graceful degradation
    return [];
  }
}

export async function getDocument<T>(collectionName: string, docId: string): Promise<(T & { id: string }) | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      console.log(`⚠️ Document ${docId} not found in ${collectionName}`);
      return null;
    }
    console.log(`✅ Loaded document ${docId} from ${collectionName}`);
    const data = { id: snapshot.id, ...snapshot.data() } as T & { id: string };
    return serializeData(data);
  } catch (error) {
    console.error(`❌ Error loading document ${docId} from ${collectionName}:`, error);
    return null;
  }
}

// Profile
export async function getProfile(): Promise<Profile | null> {
  return getDocument<Profile>("settings", "profile");
}

export async function saveProfile(data: Partial<Profile>): Promise<void> {
  try {
    const docRef = doc(db, "settings", "profile");
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    console.log("✅ Profile saved successfully");
  } catch (error) {
    console.error("❌ Error saving profile:", error);
    throw error;
  }
}

// Education
export async function getEducation(visibleOnly = false): Promise<(Education & { id: string })[]> {
  const constraints: QueryConstraint[] = [];
  if (visibleOnly) constraints.push(where("visible", "==", true));
  constraints.push(orderBy("order", "asc"));
  return getCollection<Education>("education", constraints);
}

export async function addEducation(data: Omit<Education, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "education"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateEducation(id: string, data: Partial<Education>): Promise<void> {
  await updateDoc(doc(db, "education", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteEducation(id: string): Promise<void> {
  await deleteDoc(doc(db, "education", id));
}

// Skills
export async function getSkills(visibleOnly = false): Promise<(Skill & { id: string })[]> {
  const constraints: QueryConstraint[] = [];
  if (visibleOnly) constraints.push(where("visible", "==", true));
  constraints.push(orderBy("order", "asc"));
  return getCollection<Skill>("skills", constraints);
}

export async function addSkill(data: Omit<Skill, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "skills"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateSkill(id: string, data: Partial<Skill>): Promise<void> {
  await updateDoc(doc(db, "skills", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteSkill(id: string): Promise<void> {
  await deleteDoc(doc(db, "skills", id));
}

// Projects
export async function getProjects(visibleOnly = false): Promise<(Project & { id: string })[]> {
  const constraints: QueryConstraint[] = [];
  if (visibleOnly) constraints.push(where("visible", "==", true));
  constraints.push(orderBy("order", "asc"));
  return getCollection<Project>("projects", constraints);
}

export async function getProject(id: string): Promise<(Project & { id: string }) | null> {
  return getDocument<Project>("projects", id);
}

export async function addProject(data: Omit<Project, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "projects"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, "projects", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

// Certifications
export async function getCertifications(visibleOnly = false): Promise<(Certification & { id: string })[]> {
  const constraints: QueryConstraint[] = [];
  if (visibleOnly) constraints.push(where("visible", "==", true));
  constraints.push(orderBy("order", "asc"));
  return getCollection<Certification>("certifications", constraints);
}

export async function addCertification(data: Omit<Certification, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "certifications"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCertification(id: string, data: Partial<Certification>): Promise<void> {
  await updateDoc(doc(db, "certifications", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteCertification(id: string): Promise<void> {
  await deleteDoc(doc(db, "certifications", id));
}

// Contact Messages
export async function getMessages(): Promise<(ContactMessage & { id: string })[]> {
  return getCollection<ContactMessage>("messages", [orderBy("createdAt", "desc")]);
}

export async function addMessage(data: Omit<ContactMessage, "id" | "read">): Promise<string> {
  const ref = await addDoc(collection(db, "messages"), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function markMessageRead(id: string): Promise<void> {
  await updateDoc(doc(db, "messages", id), { read: true });
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, "messages", id));
}

// App Settings
export async function getSettings(): Promise<Settings | null> {
  return getDocument<Settings>("settings", "app");
}

export async function saveSettings(data: Partial<Settings>): Promise<void> {
  const docRef = doc(db, "settings", "app");
  await setDoc(docRef, data, { merge: true });
}
